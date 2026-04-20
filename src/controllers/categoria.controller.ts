import { Request, Response } from 'express';
import { CategoriaService } from '../services/categoria.service';
import { getValidObjectId } from '../utils/objectId.helper';

const categoriaService = new CategoriaService();

export const categoriaController = {
  
  async create(req: Request, res: Response) {
    try {
      const categoria = await categoriaService.createCategory(req.body);
      res.status(201).json({ 
        success: true, 
        message: 'Categoría creada exitosamente',
        data: categoria 
      });
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ 
          success: false, 
          error: 'Ya existe una categoria con esa descripcion' 
        });
      }
      res.status(400).json({ success: false, error: error.message });
    }
  },

  async getAllCategories(req: Request, res: Response) {
    try {
      const categorias = await categoriaService.getAllCategories();
      res.json({ success: true, data: categorias });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getCategoryById(req: Request, res: Response) {
  try {
    const id = getValidObjectId(req.params.id);
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID invalido' 
      });
    }
    
    const categoria = await categoriaService.getCategoryById(id);
    if (!categoria) {
      return res.status(404).json({ 
        success: false, 
        error: 'Categoria no encontrada' 
      });
    }
    res.json({ success: true, data: categoria });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
},

  async getGamesByCategory(req: Request, res: Response) {
    try {
      const id = getValidObjectId(req.params.id);
    
      if (!id) {
      return res.status(400).json({ 
          success: false, 
          error: 'ID invalido' 
      });
      }

      const juegos = await categoriaService.getGamesByCategory(id);
      res.json({ success: true, data: juegos });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};