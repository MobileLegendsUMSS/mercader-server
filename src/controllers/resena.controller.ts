import { Request, Response } from "express";
import * as ResenaService from "../services/resena.service";
import * as TokenTypes from "../types/token.types";

export async function getReviewsByGame(req: Request, res: Response) {
  try {
    const { idJuego } = req.params;

    if (!idJuego || typeof idJuego !== "string") {
      return res.status(400).json({
        success: false,
        message: "Id de juego inválido"
      });
    }

    const { result, statusCode, messageState, data } = await ResenaService.getReviewsByGame(idJuego);

    return res.status(statusCode).json({
      success: result,
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

export async function createReview(req: Request, res: Response) {
  try {
    const { id_usuario } = req.user as TokenTypes.TokenPayload;
    const { id_juego, rating, content } = req.body;  

    if (!id_usuario || typeof id_usuario !== "string") {
      return res.status(400).json({
        success: false,
        message: "Id de usuario inválido"
      });
    }

    if (!id_juego || typeof id_juego !== "string") {
      return res.status(400).json({
        success: false,
        message: "Id de juego inválido"
      });
    }

    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {  // ← NUEVO
      return res.status(400).json({
        success: false,
        message: "La calificación debe ser entre 1 y 5 estrellas"
      });
    }

    if (!content || typeof content !== "string") {
      return res.status(400).json({
        success: false,
        message: "Contenido de la reseña requerido"
      });
    }

    const { result, statusCode, messageState, data } = await ResenaService.createReview(
      id_usuario,
      id_juego,
      rating,
      content
    );

    return res.status(statusCode).json({
      success: result,
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