import { Types } from "mongoose";
import { Usuario } from "../models/usuario.model";
import { Juego } from "../models/juego.model";
import { Carrito } from "../models/carrito.model";
import { CarritoJuego } from "../models/carritojuego.model";
import { Compra } from "../models/compra.model";
import { MetodoPago } from "../models/metodopago.model";
import * as CompraTypes from "../types/compras.types";
import * as ImagenService from "../services/imagen.service";

export async function registerUserPurchase(
  idUser: string,
  idPayMethod: string,
  paymentProof: Express.Multer.File) {
  try {
    const formatedIdUser = new Types.ObjectId(idUser);
    const foundUser = await Usuario.findById(formatedIdUser);
    if (!foundUser) {
      return {
        result: false,
        statusCode: 404,
        messageState: "Usuario no encontrado."
      };
    }

    const formatedIdPayMethod = new Types.ObjectId(idPayMethod);
    const foundPayMethod = await MetodoPago.findById(formatedIdPayMethod);
    if (!foundPayMethod) {
      return {
        result: false,
        statusCode: 404,
        messageState: "Metodo de pago no encontrado."
      };
    }

    const foundCart = await Carrito.findOne({
      id_usuario: formatedIdUser,
      activo: true
    }, "_id");
    if (!foundCart) {
      return {
        result: false,
        statusCode: 400,
        messageState: "No se puede efectuar la compra, el usuario no ha creado ningun carrito."
      };
    }

    const cartId = foundCart._id;
    const foundCartGames = await CarritoJuego.find({
      id_carrito: cartId
    }, "id_juego cantidad_solicitada");
    if (!foundCartGames || foundCartGames.length === 0) {
      return {
        result: false,
        statusCode: 400,
        messageState: "No se puede efectuar la compra, el carrito está vacío."
      };
    }
    let precio_acumulado = 0;
    for (const cartGame of foundCartGames) {
      const foundGame = await Juego.findOne({
        _id: cartGame.id_juego,
        activo: true,
        cantidad: { $ne: 0 }
      }, "precio");
      if (!foundGame) {
        return {
          result: false,
          statusCode: 400,
          messageState: "Hay juegos retirados o sin stock en el carrito, por favor, actualice el carrito."
        };
      }
      precio_acumulado += (foundGame.precio * cartGame.cantidad_solicitada);
    }
    for (const cartGame of foundCartGames) {
      const foundGame = await Juego.findOne({
        _id: cartGame.id_juego,
        activo: true,
        cantidad: { $ne: 0 }
      }, "cantidad ventas");
      if (!foundGame) {
        return {
          result: false,
          statusCode: 400,
          messageState: "Hay juegos retirados o sin stock en el carrito, por favor, actualice el carrito."
        };
      }
      const updatedGame = await Juego.findOneAndUpdate(
        { _id: foundGame._id },
        { $set: { cantidad: foundGame.cantidad - cartGame.cantidad_solicitada, ventas: foundGame.ventas + 1 } },
        { new: true }
      );
      if (!updatedGame) {
        return {
          result: false,
          statusCode: 400,
          messageState: "No se pudo actualizar el stock del juego asociado a la compra."
        };
      }
      if (updatedGame.cantidad === 0) {
        await Juego.findOneAndUpdate(
          { _id: foundGame._id },
          { $set: { disponible: false } }
        );
      }
    }

    //await CarritoJuego.deleteMany({ id_carrito: cartId });
    const updatedCart = await Carrito.findOneAndUpdate(
      { _id: cartId },
      { $set: { activo: false } },
      { new: true, runValidators: true }
    );
    if (!updatedCart) {
      return {
        result: false,
        statusCode: 400,
        messageState: "No se pudo hacer el descargo del carrito tras efectuar la compra."
      };
    }

    const paymentProofURL = await ImagenService.uploadPaymentProof(
      idUser, paymentProof.buffer, paymentProof.mimetype);

    const newPurchase = {
      id_usuario: formatedIdUser,
      id_carrito: cartId,
      id_metodo_pago: formatedIdPayMethod,
      total: precio_acumulado,
      estado: CompraTypes.PurchaseState.PENDIENTE,
      comprobante: paymentProofURL
    };
    const registeredPurchase = await Compra.create(newPurchase);
    if (!registeredPurchase) {
      return {
        result: false,
        statusCode: 400,
        messageState: "La compra no se ha podido registrar."
      };
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "La compra se ha registrado correctamente."
    }
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}

export async function getUserPurchases(idUser: string) {
  try {
    const formatedIdUser = new Types.ObjectId(idUser);
    const foundUser = await Usuario.findById(formatedIdUser);
    if (!foundUser) {
      return {
        result: false,
        statusCode: 404,
        messageState: "Usuario no encontrado."
      };
    }

    const foundPurchases = await Compra.find({
      id_usuario: formatedIdUser,
    }, "_id id_carrito id_metodo_pago total estado").select("-comprobante");
    if (!foundPurchases || foundPurchases.length === 0) {
      return {
        result: true,
        statusCode: 404,
        messageState: "El usuario no tiene compras registradas."
      };
    }

    const data = [];
    for (const purchase of foundPurchases) {
      const foundCartGames = await CarritoJuego.find({
        id_carrito: purchase.id_carrito
      }, "id_juego cantidad_solicitada");

      const cartDetails = [];
      for (const cartGame of foundCartGames) {
        const foundGame = await Juego.findOne({
          _id: cartGame.id_juego
        }, "titulo precio");
        if (!foundGame) {
          return {
            result: false,
            statusCode: 404,
            messageState: "Error al descargar informacion del carrito asociado a una compra"
          };
        }
        const cartGameData = {
          id_juego: cartGame.id_juego,
          titulo: foundGame.titulo,
          cantidad_solicitada: cartGame.cantidad_solicitada,
          precio_juegos: (foundGame.precio * cartGame.cantidad_solicitada)
        }
        cartDetails.push(cartGameData);
      }

      const foundPayMethod = await MetodoPago.findOne({
        _id: purchase.id_metodo_pago
      }, "nombre");
      //console.log(purchase.id_metodo_pago);
      if (!foundPayMethod) {
        return {
          result: false,
          statusCode: 404,
          messageState: "Metodo de pago no encontrado."
        }
      }

      const purchaceData = {
        total: purchase.total,
        estado: purchase.estado,
        metodo_pago: foundPayMethod.nombre,
        detalles_carrito: cartDetails
      }
      data.push(purchaceData);
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "Compras del usuario obtenidas correctamente",
      data: data
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}

export async function getAllPurchases() {
  try {
    const foundPurchases = await Compra.find({}, "_id id_carrito id_metodo_pago total estado comprobante");
    if (!foundPurchases || foundPurchases.length === 0) {
      return {
        result: true,
        statusCode: 404,
        messageState: "El usuario no tiene compras registradas."
      };
    }

    const data = [];
    for (const purchase of foundPurchases) {
      const foundCartGames = await CarritoJuego.find({
        id_carrito: purchase.id_carrito
      }, "id_juego cantidad_solicitada");

      const cartDetails = [];
      for (const cartGame of foundCartGames) {
        const foundGame = await Juego.findOne({
          _id: cartGame.id_juego
        }, "titulo precio");
        if (!foundGame) {
          return {
            result: false,
            statusCode: 404,
            messageState: "Error al descargar informacion del carrito asociado a una compra"
          };
        }
        const cartGameData = {
          id_juego: cartGame.id_juego,
          titulo: foundGame.titulo,
          cantidad_solicitada: cartGame.cantidad_solicitada,
          precio_juegos: (foundGame.precio * cartGame.cantidad_solicitada)
        }
        cartDetails.push(cartGameData);
      }

      const foundPayMethod = await MetodoPago.findOne({
        _id: purchase.id_metodo_pago
      }, "nombre");
      //console.log(purchase.id_metodo_pago);
      if (!foundPayMethod) {
        return {
          result: false,
          statusCode: 404,
          messageState: "Metodo de pago no encontrado."
        }
      }

      const purchaceData = {
        id_compra: purchase._id,
        total: purchase.total,
        estado: purchase.estado,
        comprobante: purchase.comprobante,
        metodo_pago: foundPayMethod.nombre,
        detalles_carrito: cartDetails
      }
      data.push(purchaceData);
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "Compras del usuario obtenidas correctamente",
      data: data
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}

export async function getPurchaseById(idPurchase: string) {
  try {
    const formatedIdPurchase = new Types.ObjectId(idPurchase);
    const foundPurchse = await Compra.findOne({
      _id: formatedIdPurchase
    }, "id_usuario id_carrito total estado comprobante createdAt");
    if (!foundPurchse) {
      return {
        result: false,
        statusCode: 404,
        messageState: "El registro de la compra solicitada no existe."
      };
    }

    const formatedIdUser = foundPurchse.id_usuario.toString();
    const foundUser = await Usuario.findOne({
      _id: formatedIdUser
    }, "nombre nombres apellidos");
    if (!foundUser) {
      return {
        result: false,
        statusCode: 404,
        messageState: "El usuario asociado a la compra no existe."
      };
    }

    const foundCartGames = await CarritoJuego.find({
      id_carrito: foundPurchse.id_carrito
    }, "id_juego cantidad_solicitada");
    if (!foundCartGames || foundCartGames.length === 0) {
      return {
        result: false,
        statusCode: 404,
        messageState: "El carrito asociado a la compra no contiene juegos."
      };
    }

    const cartDetails = [];
    for (const cartGame of foundCartGames) {
      const foundGame = await Juego.findOne({
        _id: cartGame.id_juego
      }, "titulo precio");
      if (!foundGame) {
        return {
          result: false,
          statusCode: 404,
          messageState: "Error al descargar informacion del carrito asociado a una compra"
        };
      }
      const cartGameData = {
        id_juego: cartGame.id_juego,
        titulo: foundGame.titulo,
        cantidad_solicitada: cartGame.cantidad_solicitada,
        precio_juegos: (foundGame.precio * cartGame.cantidad_solicitada)
      }
      cartDetails.push(cartGameData);
    }

    const purchaseData = {
      nombre_usuario: foundUser.nombre,
      nombres: foundUser.nombres,
      apellidos: foundUser.apellidos,
      total: foundPurchse.total,
      estado: foundPurchse.estado,
      comprobante: foundPurchse.comprobante,
      fecha_creacion: (foundPurchse.createdAt as any).toISOString(),
      detalles_carrito: cartDetails 
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "Detalle de la compra obtenido correctamente.",
      data: purchaseData
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}

export async function allowPurchase(idPurchase: string, acceptance: string) {
  try {
    const formatedIdPurchase = new Types.ObjectId(idPurchase);
    const updatedPurchase = await Compra.findOneAndUpdate(
      { _id: formatedIdPurchase },
      { $set: { estado: acceptance } },
      { new: true }
    );
    if (!updatedPurchase) {
      return {
        result: false,
        statusCode: 400,
        messageState: "Error al actualizar el estado de la compra."
      }
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "El estado de la compra se ha actualizado correctamente."
    }
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}