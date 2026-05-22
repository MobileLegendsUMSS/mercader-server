import { Request, Response } from "express";
import * as TokenTypes from "../types/token.types";
import * as UsuarioService from "../services/usuario.service";

export async function getPersonalInfo(req: Request, res: Response) {
  try {
    const { id_usuario } = req.user as TokenTypes.TokenPayload;
    
    if (!id_usuario || typeof id_usuario !== "string") {
      return res.status(400).json({
        success: false,
        message: "Id de usuario o juego invalido."
      });
    }

    const { result, statusCode, messageState, data } = await UsuarioService.getPersonalInfo(id_usuario);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    if (!data) {
      return res.status(400).json({
        success: false,
        message: "El usuario no tiene datos personales registrados."
      });
    }
    return res.status(200).json({
      result: true,
      message: "Los datos personales del usuario se han obtenido correctamente.",
      data: data
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error interno en el servidor: ${(err as Error).message}`
    });
  }
}

export async function registerFavoriteGame(req: Request, res: Response) {
  try {
    const { id_usuario } = req.user as TokenTypes.TokenPayload;
    const { id_juego } = req.query;

    if ((!id_usuario || typeof id_usuario !== "string") ||
      (!id_juego || typeof id_juego !== "string")) {
      return res.status(400).json({
        success: false,
        message: "Id de usuario o juego invalido."
      });
    }

    const { result, statusCode, messageState } = await UsuarioService.registerFavoriteGame(id_usuario, id_juego);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error interno en el servidor: ${(err as Error).message}`
    });
  }
}