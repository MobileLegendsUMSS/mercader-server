import { Types } from "mongoose";
import { Usuario } from "../models/usuario.model";
import { Juego } from "../models/juego.model";
import { Prestamo } from "../models/prestamo.model";
import { PrestamoJuego } from "../models/prestamojuego.model";
import * as PrestamoTypes from "../types/prestamos.types";
import * as ServicioTypes from "../types/servicio.types";

export async function registerUserLoan(idUser: string, idGame: string, loanInfo: PrestamoTypes.PrestamoInfo) {
  try {
    const { servicio } = loanInfo;

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

    if (!servicio || typeof servicio !== "string" || 
      (!Object.values(ServicioTypes.TipoServicio).includes(servicio))) {
      return {
        result: false,
        statusCode: 400,
        messageState: "Servicio invalido."
      }
    }
    if (loanInfo.fecha_solicitud) {
      loanInfo.fecha_solicitud = new Date(loanInfo.fecha_solicitud);
      if (isNaN(loanInfo.fecha_solicitud.getTime())) {
        return {
          result: false,
          statusCode: 400,
          messageState: "Fecha de solicitud invalida."
        };
      }
    } else {
      return {
        result: false,
        statusCode: 400,
        messageState: "Fecha de solicitud invalida."
      };
    }
    if (loanInfo.fecha_limite) {
      loanInfo.fecha_limite = new Date(loanInfo.fecha_limite);
      if (isNaN(loanInfo.fecha_limite.getTime())) {
        return {
          result: false,
          statusCode: 400,
          messageState: "Fecha de limite invalida."
        };
      }
    } else {
      return {
        result: false,
        statusCode: 400,
        messageState: "Fecha de limite invalida."
      };
    }
    if (servicio === ServicioTypes.TipoServicio.ALQUILER) {
      if (loanInfo.fecha_inicio) {
        loanInfo.fecha_inicio = new Date(loanInfo.fecha_inicio);
        if (isNaN(loanInfo.fecha_inicio.getTime())) {
          return {
            result: false,
            statusCode: 400,
            messageState: "Fecha de inicio de alquiler invalida."
          };
        }
      } else {
        return {
          result: false,
          statusCode: 400,
          messageState: "Fecha de inicio de alquiler invalida."
        };
      }
    }

    if (foundGame.cantidad > 0) {
      let newLoan;
      if (servicio === ServicioTypes.TipoServicio.ALQUILER) {
        newLoan = {
          id_usuario: idUser,
          fecha_solicitud: loanInfo.fecha_solicitud,
          fecha_limite: loanInfo.fecha_limite,
          fecha_inicio: loanInfo.fecha_inicio
        };
      } else {
        newLoan = {
          id_usuario: idUser,
          fecha_solicitud: loanInfo.fecha_solicitud,
          fecha_limite: loanInfo.fecha_limite,
        }
      }
      const createdLoan = await Prestamo.create(newLoan);
      if (!createdLoan) {
        return {
          result: false,
          statusCode: 400,
          messageState: "El prestamo no se ha podido registrar."
        };
      }

      const idLoan = createdLoan._id;
      const newLoanGame = { id_pestamo: idLoan, id_juego: formatedIdGame, servicio: servicio }
      const createdLoanGame = await PrestamoJuego.create(newLoanGame);
      if (!createdLoanGame) {
        return {
          result: false,
          statusCode: 400,
          messageState: "El juego no se ha podido registrar en el prestamo."
        };
      }
      
      await Juego.findOneAndUpdate(
        { _id: formatedIdGame},
        { $set: { cantidad: foundGame.cantidad - 1 } }
      );

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