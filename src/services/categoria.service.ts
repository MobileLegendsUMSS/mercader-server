import { Categoria, ICategoria } from '../models/categoria.model';
import { JuegoCategoria } from '../models/juegoCategoria.model';
import { Types } from 'mongoose';

export class CategoriaService {
  
  async createCategory(data: Partial<ICategoria>): Promise<ICategoria> {
    const categoria = new Categoria(data);
    return await categoria.save();
  }

  async getAllCategories(): Promise<ICategoria[]> {
    return await Categoria.find().sort({ descripcion: 1 }).exec();
  }

  async getCategoryById(id: string): Promise<ICategoria | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return await Categoria.findById(id).exec();
  }

  async deleteCategories(id: string): Promise<{ success: boolean; message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      return { success: false, message: 'ID inválido' };
    }

    // verificar si hay juegos asociados
    const associatedGames = await JuegoCategoria.findOne({ id_categoria: new Types.ObjectId(id) });
    
    if (associatedGames) {
      return { success: false, message: 'No se puede eliminar la categoria porque tiene juegos asociados' };
    }

    const result = await Categoria.findByIdAndDelete(id);
    if (!result) {
      return { success: false, message: 'Categoria no encontrada' };
    }
    
    return { success: true, message: 'Categoria eliminada exitosamente' };
  }

  async getGamesByCategory(categoriaId: string) {
    if (!Types.ObjectId.isValid(categoriaId)) return [];
    
    const relations = await JuegoCategoria.find({ id_categoria: new Types.ObjectId(categoriaId) })
      .populate('id_juego')
      .exec();
    
    return relations.map(rel => rel.id_juego);
  }
}