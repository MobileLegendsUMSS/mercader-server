import { Dificultad, IDificultad } from '../models/dificultad.model';
import { Juego } from '../models/juego.model';
import { Types } from 'mongoose';

export class DificultadService {
  
  async createDifficulty(data: Partial<IDificultad>): Promise<IDificultad> {
    const dificultad = new Dificultad(data);
    return await dificultad.save();
  }

  async getAllDifficulties(): Promise<IDificultad[]> {
    return await Dificultad.find().sort({ descripcion: 1 }).exec();
  }

  async getDifficultyById(id: string): Promise<IDificultad | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return await Dificultad.findById(id).exec();
  }

  async deleteDifficulty(id: string): Promise<{ success: boolean; message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      return { success: false, message: 'ID inválido' };
    }

    // Verificar si hay juegos con esta dificultad
    const associatedGames = await Juego.findOne({ id_dificultad: new Types.ObjectId(id) });
    
    if (associatedGames) {
      return { success: false, message: 'No se puede eliminar la dificultad porque tiene juegos asociados' };
    }

    const result = await Dificultad.findByIdAndDelete(id);
    if (!result) {
      return { success: false, message: 'Dificultad no encontrada' };
    }
    
    return { success: true, message: 'Dificultad eliminada exitosamente' };
  }

  async getGamesByDifficulty(dificultadId: string) {
    if (!Types.ObjectId.isValid(dificultadId)) return [];
    
    return await Juego.find({ id_dificultad: new Types.ObjectId(dificultadId) })
      .populate('id_editorial')
      .exec();
  }
}