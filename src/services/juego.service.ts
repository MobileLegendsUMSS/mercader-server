import { Juego, IJuego } from '../models/juego.model';
import { Types } from 'mongoose';

export class JuegoService {

    async createGame(data: Partial<IJuego>): Promise<IJuego> {
      const juego = new Juego(data);
      return await juego.save();
  }

  async getAllGames(): Promise<IJuego[]> {
    return await Juego.find()
      .populate('id_dificultad')
      .populate('id_editorial')
      .exec();
  }

  async getGameById(id: string): Promise<IJuego | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return await Juego.findById(id)
      .populate('id_dificultad')
      .populate('id_editorial')
      .exec();
  }
}