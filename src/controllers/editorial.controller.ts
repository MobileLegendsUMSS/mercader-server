import { Request, Response } from 'express';
import { EditorialService } from '../services/editorial.service';
import { getValidObjectId } from '../utils/objectId.helper';

const editorialService = new EditorialService();

export const editorialController = {
  
  async create(req: Request, res: Response) {
    try {
      const editorial = await editorialService.createEditorial(req.body);
      res.status(201).json({ 
        success: true, 
        message: 'Editorial creada exitosamente',
        data: editorial 
      });
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ 
          success: false, 
          error: 'Ya existe una editorial con esa descripcion' 
        });
      }
      res.status(400).json({ success: false, error: error.message });
    }
  },

  async getAllEditorials(req: Request, res: Response) {
    try {
      const editorials = await editorialService.getAllEditorials();
      res.json({ success: true, data: editorials });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getEditorialById(req: Request, res: Response) {
    try {
      const id = getValidObjectId(req.params.id);
      
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID invalido' 
        });
      }
      
      const editorial = await editorialService.getEditorialById(id);
      if (!editorial) {
        return res.status(404).json({ 
          success: false, 
          error: 'Editorial no encontrada' 
        });
      }
      res.json({ success: true, data: editorial });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};