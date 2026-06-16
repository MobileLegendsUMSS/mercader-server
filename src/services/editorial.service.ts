import { Editorial, IEditorial } from '../models/editorial.model';
import { Juego } from '../models/juego.model';
import { Types } from 'mongoose';

export class EditorialService {

  async createEditorial(data: Partial<IEditorial>): Promise<IEditorial> {
    const editorial = new Editorial(data);
    return await editorial.save();
  }

  async getAllEditorials(): Promise<IEditorial[]> {
    return await Editorial.find().sort({ descripcion: 1 }).exec();
  }

  async getEditorialById(id: string): Promise<IEditorial | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return await Editorial.findById(id).exec();
  }

  async updateEditorial(id: string, data: Partial<IEditorial>): Promise<{ success: boolean; message: string; data?: IEditorial }> {
    if (!Types.ObjectId.isValid(id)) {
      return { success: false, message: 'ID inválido' };
    }

    const editorial = await Editorial.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
    if (!editorial) {
      return { success: false, message: 'Editorial no encontrada' };
    }

    return { success: true, message: 'Editorial actualizada exitosamente', data: editorial };
  }

  async deleteEditorial(id: string): Promise<{ success: boolean; message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      return { success: false, message: 'ID inválido' };
    }

    const associatedGames = await Juego.findOne({ id_editorial: new Types.ObjectId(id) });

    if (associatedGames) {
      return { success: false, message: 'No se puede eliminar la editorial porque tiene juegos asociados' };
    }

    const result = await Editorial.findByIdAndDelete(id);
    if (!result) {
      return { success: false, message: 'Editorial no encontrada' };
    }

    return { success: true, message: 'Editorial eliminada exitosamente' };
  }
}