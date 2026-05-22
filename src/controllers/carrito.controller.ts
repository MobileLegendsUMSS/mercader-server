import { Request, Response } from "express";
import { Juego } from "../models/juego.model";
import * as CarritoService from "../services/carrito.service";
import * as TokenTypes from "../types/token.types";

export async function registerGameCart(req: Request, res: Response) {
  try {
    const { id_usuario } = req.user as TokenTypes.TokenPayload;
    const { id_juego, cantidad } = req.body;

    if ((!id_usuario || typeof id_usuario !== "string") ||
      (!id_juego || typeof id_juego !== "string")) {
      return res.status(400).json({
        success: false,
        message: "Id de usuario o juego invalido."
      });
    }
    if (!cantidad || typeof cantidad !== "number") {
      return res.status(400).json({
        success: false,
        message: "Cantidad solicitada de juegos invalida."
      });
    }

    const { result, statusCode, messageState } = await CarritoService.registerGameCart(id_usuario, id_juego, cantidad);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    return res.status(200).json({
      success: true,
      message: messageState
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error interno en el servidor: ${(err as Error).message}`
    });
  }
}

export async function viewGamesCart(req: Request, res: Response) {
  try {
    const { id_usuario } = req.user as TokenTypes.TokenPayload;

    if (!id_usuario || typeof id_usuario !== "string") {
      return res.status(400).json({
        success: false,
        message: "Id de usuario invalido."
      });
    }

    const { result, statusCode, messageState, data } = await CarritoService.viewGamesCart(id_usuario);
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
      success: false,
      message: `Error interno en el servidor: ${(err as Error).message}`
    });
  }
}

export async function updateGameCart(req: Request, res: Response) {
  try {
    const { id_usuario } = req.user as TokenTypes.TokenPayload;
    const { id_juego, cantidad } = req.body;

    if ((!id_usuario || typeof id_usuario !== "string") ||
      (!id_juego || typeof id_juego !== "string")) {
      return res.status(400).json({
        success: false,
        message: "Id de usuario o juego invalido."
      });
    }
    if (!cantidad || typeof cantidad !== "number") {
      return res.status(400).json({
        success: false,
        message: "Cantidad solicitada de juegos invalida."
      });
    }

    const { result, statusCode, messageState } = await CarritoService.updateGameCart(id_usuario, id_juego, cantidad);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    return res.status(200).json({
      success: true,
      message: messageState
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error interno en el servidor: ${(err as Error).message}`
    });
  }
}

export async function deleteGameCart(req: Request, res: Response) {
  try {
    const { id_usuario } = req.user as TokenTypes.TokenPayload;
    const { id_juego } = req.body;

    if ((!id_usuario || typeof id_usuario !== "string") ||
      (!id_juego || typeof id_juego !== "string")) {
      return res.status(400).json({
        success: false,
        message: "Id de usuario o juego invalido."
      });
    }

    const { result, statusCode, messageState } = await CarritoService.deleteGameCart(id_usuario, id_juego);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    return res.status(200).json({
      success: true,
      message: messageState
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error interno en el servidor: ${(err as Error).message}`
    });
  }
}