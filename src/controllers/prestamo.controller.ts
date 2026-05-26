import { Request, Response } from "express";
import { toBoliviaTime } from "../utils/date.helper";
import * as ServicioTypes from "../types/servicio.types";
import * as PrestamoService from "../services/prestamo.service";
import * as TokenTypes from "../types/token.types";

export async function registerUserLoan(req: Request, res: Response) {
  try {

    const { id_usuario } = req.user as TokenTypes.TokenPayload;
    const { id_juego } = req.query;
    const { servicio, fecha_prestamo } = req.body;

    if ((!id_usuario || typeof id_usuario !== "string") ||
      (!id_juego || typeof id_juego !== "string")) {
      return res.status(400).json({
        success: false,
        message: "Id de usuario o juego invalido."
      });
    }
    if (!servicio || typeof servicio !== "string" || 
      (!Object.values(ServicioTypes.TipoServicio).includes(servicio as ServicioTypes.TipoServicio))) {
      return res.status(400).json({
        success: false,
        message: "Servicio invalido."
      });
    }
    if (servicio === ServicioTypes.TipoServicio.COMPRA) {
      return res.status(400).json({
        success: false,
        message: "Servicio invalido."
      });
    }
    if (!fecha_prestamo) {
      return res.status(400).json({
        success: false,
        message: "Fecha de solicitud requerida."
      });
    }
    const loanDate = toBoliviaTime(fecha_prestamo);
    console.log(loanDate);
    if (isNaN(loanDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Fecha de solicitud invalida."
      });
    }
    const today = new Date();
    if (loanDate > today) {
      return res.status(400).json({
        success: false,
        message: "La fecha de prestamo no puede ser futura."
      });
    }
    if (loanDate.getUTCFullYear() !== today.getUTCFullYear() ||
      loanDate.getUTCMonth() !== today.getUTCMonth() ||
      loanDate.getUTCDate() !== today.getUTCDate()) {
      return res.status(400).json({
        success: false,
        message: "Fecha de prestamo no correspondiente al dia de hoy."
      });
    }

    const { result, statusCode, messageState } = await PrestamoService.registerUserLoan(id_usuario, id_juego, servicio, loanDate);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    return res.status(200).json({
      success: true,
      message: "El prestamo se ha registrado exitosamente."
    }); 
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error interno del servidor: ${(err as Error).message}`
    });
  }
}

export async function getUserLoans(req: Request, res: Response) {
  try {
    const { id_usuario } = req.user as TokenTypes.TokenPayload;
    const { vigent, collected, returned } = req.body;
    
    if (!id_usuario || typeof id_usuario !== "string") {
      return res.status(400).json({
        success: false,
        message: "Id de usuario invalido."
      });
    }
    if (vigent === null || vigent === undefined || typeof vigent !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Estado de vigencia de prestamo invalido."
      });
    }
    if (collected === null || collected === undefined || typeof collected !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Estado de recoleccion de prestamo invalido."
      });
    }
    if (returned === null || returned === undefined || typeof returned !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Estado de devolucion de prestamo invalido."
      });
    }

    const { result, statusCode, messageState, data } = await PrestamoService.getUserLoans(id_usuario, vigent, collected, returned);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    if (!data || data.length === 0) {
      return res.status(200).json({
        success: true,
        message: "El usuario no tiene prestamos vigentes registrados."
      });
    }
    return res.status(200).json({
      success: true,
      message: "Prestamos del usuario obtenidos exitosamente.",
      data: data
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error interno del servidor: ${(err as Error).message}`
    });
  }
}

export async function updateUserLoan(req: Request, res: Response) {
  try {
    const { id_usuario } = req.user as TokenTypes.TokenPayload;
    const { id_prestamo } = req.query;
    const { fecha_inicio, fecha_fin } = req.body; 

    if (!id_usuario || typeof id_usuario !== "string") {
      return res.status(400).json({
        success: false,
        message: "Id de usuario invalido."
      });
    }
    if (!id_prestamo || typeof id_prestamo !== "string") {
      return res.status(400).json({
        success: false,
        message: "Id de prestamo invalido."
      });
    }
    const today = new Date();
    let startDate;
    if (fecha_inicio) {
      startDate = toBoliviaTime(fecha_inicio);
      if (isNaN(startDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Fecha de inicio de prestamo invalida."
        });
      }
      if (startDate > today) {
        return res.status(400).json({
          success: false,
          message: "La fecha de inicio de prestamo no puede ser futura."
        });
      }
    }
    let ans;
    if (fecha_fin) {
      const endDate = toBoliviaTime(fecha_fin);
      if (isNaN(endDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "La fecha de fin de prestamo es invalida."
        });
      }
      if (endDate > today) {
        return res.status(400).json({
          success: false, 
          message: "La fecha de fin de prestamo no puede ser futura."
        });
      }
      ans = await PrestamoService.updateUserLoan(id_prestamo, id_usuario, startDate, endDate);
    } else {
      ans = await PrestamoService.updateUserLoan(id_prestamo, id_usuario, startDate);
    }

    const { result, statusCode, messageState } = ans;
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      })
    }
    return res.status(200).json({
      success: true,
      message: "El prestamo ha sido actualizado correctamente."
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error interno del servidor: ${(err as Error).message}`
    }); 
  }
}

export async function deleteUserLoan(req: Request, res: Response) {
  try {
    const { id_usuario } = req.user as TokenTypes.TokenPayload;
    const { id_prestamo } = req.query;

    if (!id_usuario || typeof id_usuario !== "string") {
      return res.status(400).json({
        success: false,
        message: "Id de usuario invalido."
      });
    }
    if (!id_prestamo || typeof id_prestamo !== "string") {
      return res.status(400).json({
        success: false,
        message: "Id de prestamo invalido."
      });
    }

    const { result, statusCode, messageState } = await PrestamoService.deleteUserLoan(id_prestamo, id_usuario);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    return res.status(200).json({
      success: true,
      message: "El prestamo ha sido eliminado correctamente."
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error interno del servidor: ${(err as Error).message}`
    }); 
  }
}