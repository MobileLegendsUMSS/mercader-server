import { Editorial, IEditorial } from '../models/editorial.model';
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
}