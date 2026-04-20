import { Request, Response } from 'express';
import { JuegoService } from '../services/juego.service';

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