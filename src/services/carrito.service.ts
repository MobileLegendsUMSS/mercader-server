import { Types } from "mongoose";
import { Usuario } from "../models/usuario.model";
import { Juego } from "../models/juego.model";
import { Carrito } from "../models/carrito.model";
import { CarritoJuego } from "../models/carritojuego.model";
import { ServicioJuego } from "../models/servicioJuego.model";
import { Servicio } from "../models/servicio.model";

export async function registerGameCart(idUser: string, idGame: string, amount: number) {
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

    const formatedIdGame = new Types.ObjectId(idGame);
    const foundGame = await Juego.findById(formatedIdGame);
    if (!foundGame) {
      return {
        result: false,
        statusCode: 404,
        messageState: "Juego no encontrado."
      };
    }
    if (amount <= 0 || amount > foundGame.cantidad) {
      return {
        result: false,
        statusCode: 400,
        messageState: "Cantidad solicitada de juegos esta fuera de Stock."
      };
    }

    const purchaseServiceId = await Servicio.findOne({ nombre: "compra" }, "_id");
    if (!purchaseServiceId) {
      return {
        result: false,
        statusCode: 404,
        messageState: "El servicio de compra no existe."
      };
    }
    const foundServiceGame = await ServicioJuego.find({
      id_juego: formatedIdGame,
      id_servicio: purchaseServiceId._id
    });
    if (!foundServiceGame || foundServiceGame.length === 0) {
      return {
        result: false,
        statusCode: 404,
        messageState: "El juego no se encuentra disponible para su compra."
      };
    }

    let currentCartId;
    const foundCart = await Carrito.findOne({ 
      id_usuario: formatedIdUser,
      activo: true
    }, "_id");
    if (!foundCart) {
      const newCart = { id_usuario: formatedIdUser, activo: true };
      const createdCart = await Carrito.create(newCart);
      if (!createdCart) {
        return {
          result: false,
          statusCode: 400,
          messageState: "El carrito no se pudo crear correctamente."
        };
      }
      currentCartId = createdCart._id;
    } else {
      currentCartId = foundCart._id;
    }
    
    const newCartGame = { id_carrito: currentCartId, id_juego: formatedIdGame, cantidad_solicitada: amount};
    const createdCartGame = await CarritoJuego.create(newCartGame);
    if (!createdCartGame) {
      return {
        result: false,
        statusCode: 400,
        messageState: "El juego no se ha podido asociar en el carrito."
      };
    }
    return {
      result: true,
      statusCode: 200,
      messageState: `El juego: ${foundGame.titulo} se ha registrado correctamente en el carrito.`
    }
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}

export async function viewGamesCart(idUser: string) {
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

    const foundCart = await Carrito.findOne({ 
      id_usuario: formatedIdUser,
      activo: true
    }, "_id");
    if (!foundCart) {
      return {
        result: true,
        statusCode: 200,
        messageState: "El usuario no ha creado ningun carrito."
      };
    }
    
    const foundCartGames = await CarritoJuego.find({
      id_carrito: foundCart._id 
    }, "id_juego cantidad_solicitada");
    if (!foundCartGames || foundCartGames.length === 0) {
      return {
        result: true,
        statusCode: 200,
        messageState: "El carrito está vacío."
      };
    }
    const data = [];
    for (const cartGame of foundCartGames) {
      const foundGame = await Juego.findOne({
        _id: cartGame.id_juego,
        activo: true,
        cantidad: { $ne: 0 }
      }, "titulo precio");
      if (!foundGame) {
        await CarritoJuego.findOneAndDelete({ id_carrito: foundCart._id, id_juego: cartGame.id_juego });
        continue;
      }
      const cartGameData = {
        id_juego: cartGame.id_juego,
        titulo: foundGame.titulo,
        cantidad_solicitada: cartGame.cantidad_solicitada,
        precio_juegos: (foundGame.precio * cartGame.cantidad_solicitada)
      }
      data.push(cartGameData);
    }
    if (data.length === 0) {
      return {
        result: true,
        statusCode: 200,
        messageState: "El carrito está vacío."
      };
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "Carrito obtenido correctamente.",
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

export async function updateGameCart(idUser: string, idGame: string, amount: number) {
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

    const formatedIdGame = new Types.ObjectId(idGame);
    const foundGame = await Juego.findById(formatedIdGame);
    if (!foundGame) {
      return {
        result: false,
        statusCode: 404,
        messageState: "Juego no encontrado."
      };
    }
    if (amount <= 0 || amount > foundGame.cantidad) {
      return {
        result: false,
        statusCode: 400,
        messageState: "Cantidad solicitada de juegos esta fuera de Stock."
      };
    }
    
    const foundCart = await Carrito.findOne({ 
      id_usuario: formatedIdUser,
      activo: true
    }, "_id");
    if (!foundCart) {
      return {
        result: false,
        statusCode: 404,
        messageState: "Carrito no encontrado."
      };
    }
    const updatedCartGame = await CarritoJuego.findOneAndUpdate(
      { id_carrito: foundCart._id, id_juego: formatedIdGame },
      { cantidad_solicitada: amount },
      { new: true }
    );
    if (!updatedCartGame) {
      return {
        result: false,
        statusCode: 404,
        messageState: "El juego no se encuentra registrado en el carrito."
      };
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "Carrito actualizado correctamente."
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}

export async function deleteGameCart(idUser: string, idGame: string) {
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

    const formatedIdGame = new Types.ObjectId(idGame);
    const foundGame = await Juego.findById(formatedIdGame);
    if (!foundGame) {
      return {
        result: false,
        statusCode: 404,
        messageState: "Juego no encontrado."
      };
    }
    
    const foundCart = await Carrito.findOne({ 
      id_usuario: formatedIdUser,
      activo: true
    }, "_id");
    if (!foundCart) {
      return {
        result: false,
        statusCode: 404,
        messageState: "Carrito no encontrado, el usuario no tiene un carrito creado."
      };
    }

    const deletedCartGame = await CarritoJuego.findOneAndDelete({
      id_carrito: foundCart._id,
      id_juego: formatedIdGame
    });
    if (!deletedCartGame) {
      return {
        result: false,
        statusCode: 404,
        messageState: "El juego no se encuentra registrado en el carrito."
      };
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "Juego eliminado del carrito correctamente."
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}