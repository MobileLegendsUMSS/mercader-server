import { Request, Response } from 'express';
import { JuegoService } from '../services/juego.service';
import * as GameService from "../services/juego.service";

const juegoService = new JuegoService();

interface ParamsDictionary {
  id: string;
}

export const juegoController = {
  async create(req: Request, res: Response) {
    try {
      const juego = await juegoService.createGame(req.body);
      res.status(201).json({ success: true, data: juego });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  async getAllGames(req: Request, res: Response) {
    try {
      const juegos = await juegoService.getAllGames();
      res.json({ success: true, data: juegos });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getGameById(req: Request<ParamsDictionary>, res: Response) {
    try {
      const juego = await juegoService.getGameById(req.params.id);
      if (!juego) {
        return res.status(404).json({ success: false, error: 'Juego no encontrado' });
      }
      res.json({ success: true, data: juego });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

export async function deleteGameById(req: Request, res: Response) {
  try {
    const { id } = req.query;
    const { justificacionRetiro } = req.body;

    if (!id || typeof id !== "string" ||
      !justificacionRetiro || typeof justificacionRetiro !== "string") {
      return res.status(400).json({
        success: false,
        message: "Parametros invalidos o vacios."
      });
    }
    
    const { result, statusCode, messageState, deletedGame } = await GameService.deleteGameById(id, justificacionRetiro);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    return res.status(200).json({
      success: true,
      message: "El juego solicitado ha sido eliminado.",
      data: deletedGame
    });
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno del servidor: ${(err as Error).message}`   
    }
  }
}