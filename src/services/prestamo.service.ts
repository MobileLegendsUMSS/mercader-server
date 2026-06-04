import { Types } from "mongoose";
import { Usuario } from "../models/usuario.model";
import { Juego } from "../models/juego.model";
import { Prestamo } from "../models/prestamo.model";
import { PrestamoJuego } from "../models/prestamojuego.model";
import { ServicioJuego } from "../models/servicioJuego.model";
import { Servicio } from "../models/servicio.model";
import * as ServicioTypes from "../types/servicio.types";

export async function registerUserLoan(idUser: string, idGame: string, service: string, loanDate: Date) {
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
    const foundGame = await Juego.findOne({
      _id: formatedIdGame,
      activo: true,
      cantidad: { $gt: 0 },
      disponible: true
    });
    if (!foundGame) {
      return {
        result: false,
        statusCode: 404,
        messageState: "El juego solicitado no tiene unidades disponibles."
      };
    }

    const foundService = await Servicio.findOne({
      nombre: service
    });
    if (!foundService) {
      return {
        result: false,
        statusCode: 404,
        messageState: "Servicio no encontrado."
      };
    }
    const foundServiceGame = await ServicioJuego.find({
      id_juego: formatedIdGame,
      id_servicio: foundService._id
    }, "id_servicio");
    if (!foundServiceGame || foundServiceGame.length === 0) {
      return {
        result: false,
        statusCode: 404,
        messageState: "El juego solicitado no esta disponible para prestamos ni alquileres."
      };
    }

    const limitTime = (service === ServicioTypes.TipoServicio.ALQUILER) ? 24 : 3;
    const limitDate = new Date(loanDate.getTime() + (limitTime * 60 * 60 * 1000));

    if (foundGame.cantidad > 0) {
      const newLoan = {
        id_usuario: idUser,
        fecha_solicitud: loanDate,
        fecha_limite: limitDate
      };
      const createdLoan = await Prestamo.create(newLoan);
      if (!createdLoan) {
        return {
          result: false,
          statusCode: 400,
          messageState: "El prestamo no se ha podido registrar."
        };
      }

      const idLoan = createdLoan._id;
      const newLoanGame = { id_prestamo: idLoan, id_juego: formatedIdGame, servicio: service }
      const createdLoanGame = await PrestamoJuego.create(newLoanGame);
      if (!createdLoanGame) {
        return {
          result: false,
          statusCode: 400,
          messageState: "El juego no se ha podido registrar en el prestamo."
        };
      }

      const updatedGame = await Juego.findOneAndUpdate(
        { _id: formatedIdGame },
        { $set: { cantidad: foundGame.cantidad - 1, cantidad_prestamo: foundGame.cantidad_prestamo + 1, prestamos: foundGame.prestamos + 1 } },
        { new: true }
      );
      if (!updatedGame) {
        return {
          result: false,
          statusCode: 400,
          messageState: "No se pudo actualizar el stock del juego asociado al prestamo."
        }
      }
      if (updatedGame.cantidad === 0) {
        await Juego.findOneAndUpdate(
          { _id: formatedIdGame },
          { $set: { disponible: false } }
        );
      }

      return {
        result: true,
        statusCode: 200,
        messageState: "El prestamo se ha registrado correctamente."
      }
    } else {
      return {
        result: false,
        statusCode: 404,
        messageState: "No hay unidades disponibles para efectuar el prestamo del juego."
      };
    }
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}

export async function getUserLoans(idUser: string, vigent: boolean, collected: boolean, returned: boolean) {
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

    let findCondition = { id_usuario: formatedIdUser }
    let magicWord = "";
    if (vigent) {
      Object.assign(findCondition, { fecha_limite: { $gt: new Date() }, fecha_fin: { $exists: false } });
      magicWord += "vigentes/";
    }
    if (collected) {
      Object.assign(findCondition, { fecha_inicio: { $exists: true } });
      magicWord += "regogidos/";
    }
    if (returned) {
      Object.assign(findCondition, { fecha_fin: { $exists: true } });
      magicWord += "devueltos"
    }
    const foundUserLoans = await Prestamo.find(findCondition);
    if (!foundUserLoans || foundUserLoans.length === 0) {
      return {
        result: true,
        statusCode: 200,
        messageState: `El usuario no tiene prestamos ${magicWord} registrados.`
      };
    }

    const data = [];
    for (const loan of foundUserLoans) {
      const foundLoanGame = await PrestamoJuego.findOne({
        id_prestamo: loan._id
      }, "id_juego servicio");
      if (!foundLoanGame) {
        return {
          result: false,
          statusCode: 404,
          messageState: "No se ha encontrado el juego que esta asociado al prestamo."
        };
      }
      const foundGame = await Juego.findOne({
        _id: foundLoanGame.id_juego,
        activo: true
      }, "titulo descripccion");
      if (!foundGame) {
        return {
          result: false,
          statusCode: 404,
          messageState: "El juego asociado al prestamo no existe o no esta disponible."
        };
      }
      const loanInfo = {
        id_prestamo: loan._id,
        titulo: foundGame.titulo,
        descripcion: foundGame.descripcion,
        servicio: foundLoanGame.servicio,
        fecha_solicitud: new Date((loan.fecha_solicitud).getTime() - (4 * 60 * 60 * 1000)),
        fecha_limite: new Date((loan.fecha_limite).getTime() - (4 * 60 * 60 * 1000))
      };
      if (loan.fecha_inicio) {
        Object.assign(loanInfo, { fecha_inicio: (new Date((loan.fecha_inicio).getTime() - (4 * 60 * 60 * 1000))) });
      }
      if (loan.fecha_fin) {
        Object.assign(loanInfo, { fecha_fin: (new Date((loan.fecha_fin).getTime() - (4 * 60 * 60 * 1000))) });
      }
      data.push(loanInfo);
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "Prestamos del usuario obtenidos exitosamente.",
      data: data
    }
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}

export async function updateUserLoan(
  idLoan: string,
  startDate: Date | undefined,
  endDate?: Date) {
  try {
    const formatedIdLoan = new Types.ObjectId(idLoan);
    const foundLoan = await Prestamo.findOne({
      _id: formatedIdLoan
    });
    if (!foundLoan) {
      return {
        result: false,
        statusCode: 404,
        messageState: "Prestamo consultado no encontrado."
      };
    }

    let currentStartDate;
    if (!startDate) {
      currentStartDate = foundLoan.fecha_inicio;
    } else {
      currentStartDate = startDate;
    }

    const loanDate = foundLoan.fecha_solicitud;
    const limitDate = foundLoan.fecha_limite;
    if (currentStartDate < loanDate || currentStartDate > limitDate) {
      return {
        result: false,
        statusCode: 400,
        messageState: "La fecha de inicio de prestamo debe estar entre la fecha de solicitud de prestamo y la fecha de limite de prestamo."
      }
    }
    let updateCondition = { fecha_inicio: currentStartDate };
    if (endDate) {
      if (endDate < currentStartDate || endDate < loanDate) {
        return {
          result: false,
          statusCode: 400,
          messageState: "La fecha de fin de prestamo no puede ser antes que la fecha de inicio o solicitud de prestamo."
        }
      }
      if (endDate > limitDate) {
        //Aplicar penalizacion para el usuario
      }
      Object.assign(updateCondition, { fecha_fin: endDate });

      const foundLoanGame = await PrestamoJuego.findOne({
        id_prestamo: formatedIdLoan
      }, "id_juego");
      if (!foundLoanGame) {
        return {
          result: false,
          statusCode: 400,
          messageState: "El juego asociado al prestamo no existe o no esta disponible."
        };
      }
      const foundGame = await Juego.findOne({
        _id: foundLoanGame.id_juego
      });
      if (!foundGame) {
        return {
          result: false,
          statusCode: 400,
          messageState: "El juego asociado al prestamo no existe o no esta disponible."
        };
      }
      const updatedGame = await Juego.findOneAndUpdate(
        { _id: foundGame._id },
        { $set: { cantidad: foundGame.cantidad + 1, cantidad_prestamo: foundGame.cantidad_prestamo - 1 } },
        { new: true }
      );
      if (!updatedGame) {
        return {
          result: false,
          statusCode: 400,
          messageState: "No se pudo actualizar el stock del juego asociado al prestamo correctamente."
        };
      }
    }
    const updatedLoan = await Prestamo.findOneAndUpdate(
      { _id: formatedIdLoan },
      { $set: updateCondition },
      { new: true }
    );
    if (!updatedLoan) {
      return {
        result: false,
        statusCode: 400,
        messageState: "No se pudo actualizar correctamente el prestamo."
      };
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "El prestamo se ha actualizado correctamente."
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}

export async function deleteUserLoan(idLoan: string) {
  try {
    const formatedIdLoan = new Types.ObjectId(idLoan);
    const foundLoan = await Prestamo.findOne({
      _id: formatedIdLoan,
    });
    if (!foundLoan) {
      return {
        result: false,
        statusCode: 404,
        messageState: "Prestamo consultado no encontrado."
      };
    }

    const deletedUserLoan = await Prestamo.findOneAndDelete({
      _id: formatedIdLoan
    });
    if (!deletedUserLoan) {
      return {
        result: false,
        statusCode: 400,
        messageState: "El prestamo no se pudo eliminar correctamente."
      };
    }

    const deletedLoanGame = await PrestamoJuego.findOneAndDelete({
      id_prestamo: formatedIdLoan
    });
    if (!deletedLoanGame) {
      return {
        result: false,
        statusCode: 400,
        messageState: "El prestamo no se pudo eliminar correctamente."
      };
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "El prestamo ha sido eliminado correctamente."
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}

export async function getAllLoans(vigent: boolean, collected: boolean, returned: boolean) {
  try {
    let findCondition = {};
    let magicWord = "";
    if (vigent) {
      Object.assign(findCondition, { fecha_limite: { $gt: new Date() }, fecha_fin: { $exists: false } });
      magicWord += "vigentes/";
    }
    if (collected) {
      Object.assign(findCondition, { fecha_inicio: { $exists: true } });
      magicWord += "regogidos/";
    }
    if (returned) {
      Object.assign(findCondition, { fecha_fin: { $exists: true } });
      magicWord += "devueltos"
    }
    const foundLoans = await Prestamo.find(findCondition);
    if (!foundLoans || foundLoans.length === 0) {
      return {
        result: true,
        statusCode: 200,
        messageState: `El usuario no tiene prestamos ${magicWord} registrados.`
      };
    }

    const data = [];
    for (const loan of foundLoans) {
      const foundLoanGame = await PrestamoJuego.findOne({
        id_prestamo: loan._id
      }, "id_juego servicio");
      if (!foundLoanGame) {
        return {
          result: false,
          statusCode: 404,
          messageState: "No se ha encontrado el juego que esta asociado al prestamo."
        };
      }
      const foundGame = await Juego.findOne({
        _id: foundLoanGame.id_juego,
        activo: true
      }, "titulo descripccion");
      if (!foundGame) {
        return {
          result: false,
          statusCode: 404,
          messageState: "El juego asociado al prestamo no existe o no esta disponible."
        };
      }
      const loanInfo = {
        id_prestamo: loan._id,
        titulo: foundGame.titulo,
        descripcion: foundGame.descripcion,
        servicio: foundLoanGame.servicio,
        fecha_solicitud: new Date((loan.fecha_solicitud).getTime() - (4 * 60 * 60 * 1000)),
        fecha_limite: new Date((loan.fecha_limite).getTime() - (4 * 60 * 60 * 1000))
      };
      if (loan.fecha_inicio) {
        Object.assign(loanInfo, { fecha_inicio: (new Date((loan.fecha_inicio).getTime() - (4 * 60 * 60 * 1000))) });
      }
      if (loan.fecha_fin) {
        Object.assign(loanInfo, { fecha_fin: (new Date((loan.fecha_fin).getTime() - (4 * 60 * 60 * 1000))) });
      }
      data.push(loanInfo);
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "Prestamos del usuario obtenidos exitosamente.",
      data: data
    }
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}