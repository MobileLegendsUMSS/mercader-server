import { Request, Response } from 'express';
import { CategoriaService } from '../services/categoria.service';
import { getValidObjectId } from '../utils/objectId.helper';
import * as CategoryService from "../services/categoria.service";

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
      const { result, statusCode, messageState, foundedCategories } = await CategoryService.getAllCategories();
      if (!result) {
        return res.status(statusCode).json({
          success: false,
          message: messageState
        });
      }
      if (!foundedCategories) {
        return res.status(200).json({
          success: true,
          message: "No existen categorias registradas."
        });
      }
      res.status(200).json({
        success: true,
        message: "Se encontraron todas las categorias registradas exitosamente.",
        data: foundedCategories
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        message: `Error interno del servidor: ${(err as Error).message}` 
      });
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