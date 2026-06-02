import { Request, Response } from "express";
import * as TokenTypes from "../types/token.types";
import * as CompraService from "../services/compra.service";

export async function registerUserPurchase(req: Request, res: Response) {
  try {
    const { id_usuario } = req.user as TokenTypes.TokenPayload;
    const { id_metodo_pago } = req.body;
    const comprobante = req.file as Express.Multer.File;

    if ((!id_usuario || typeof id_usuario !== "string") ||
      (!id_metodo_pago || typeof id_metodo_pago !== "string")) {
      return res.status(400).json({
        success: false,
        message: "Id de usuario o metodo de pago invalido."
      });
    }
    if (!comprobante || (comprobante && !comprobante.mimetype.startsWith("image/"))) {
      return res.status(400).json({
        success: false,
        message: "Imagen de comprobante de pago invalida."
      });
    }

    const { result, statusCode, messageState } = await CompraService.registerUserPurchase(id_usuario, id_metodo_pago, comprobante);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    return res.status(200).json({
      success: true,
      message: "La compra se ha registrado exitosamente."
    }); 
  } catch (err) {
    return res.status(500).json({
      success: true,
      message: `Error interno del servidor: ${(err as Error).message}`
    });
  }
}

export async function getUserPurchases(req: Request, res: Response) {
  try {
    const { id_usuario } = req.user as TokenTypes.TokenPayload;

    if (!id_usuario || typeof id_usuario !== "string") {
      return res.status(400).json({
        success: false,
        message: "Id de usuario invalido."
      });
    }

    const { result, statusCode, messageState, data } = await CompraService.getUserPurchases(id_usuario);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    return res.status(200).json({
      success: true,
      message: messageState,
      data: data
    });
  } catch (err) {
    return res.status(500).json({
      success: true,
      message: `Error interno del servidor: ${(err as Error).message}`
    });
  }
}