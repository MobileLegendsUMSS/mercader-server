import { Request, Response } from "express";
import * as PrestamoService from "../services/prestamo.service";

export async function registerUserLoan(req: Request, res: Response) {
  try {
    const { id_usuario, id_juego } = req.query;
    const loanInfo = req.body;

     if ((!id_usuario || typeof id_usuario !== "string") ||
      (!id_juego || typeof id_juego !== "string")) {
      return res.status(400).json({
        success: false,
        message: "Id de usuario o juego invalido."
      });
    }
    if (!loanInfo || Object.keys(loanInfo).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Informacion del prestamo invalida o incompleta."
      });
    }

    const { result, statusCode, messageState } = await PrestamoService.registerUserLoan(id_usuario, id_juego, loanInfo);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    return res.status(200).json({
      success: true,
      message: "Compra registrada exitosamente."
    }); 
  } catch (err) {
    return res.status(500).json({
      success: true,
      message: `Error interno del servidor: ${(err as Error).message}`
    });
  }
}