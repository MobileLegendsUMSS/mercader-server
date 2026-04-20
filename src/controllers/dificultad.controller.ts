import { Request, Response } from 'express';
import { DificultadService } from '../services/dificultad.service';
import { getValidObjectId } from '../utils/objectId.helper';

const dificultadService = new DificultadService();

export const dificultadController = {
  
  async create(req: Request, res: Response) {
    try {
      const dificultad = await dificultadService.createDifficulty(req.body);
      res.status(201).json({ 
        success: true, 
        message: 'Dificultad creada exitosamente',
        data: dificultad 
      });
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ 
          success: false, 
          error: 'Ya existe una dificultad con esa descripción' 
        });
      }
      res.status(400).json({ success: false, error: error.message });
    }
  },

  async getAllDifficulties(req: Request, res: Response) {
    try {
      const dificultades = await dificultadService.getAllDifficulties();
      res.json({ success: true, data: dificultades });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getDifficultyById(req: Request, res: Response) {
    try {
      const id = getValidObjectId(req.params.id);

      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID invalido' 
        });
      }

      const dificultad = await dificultadService.getDifficultyById(id);
      if (!dificultad) {
        return res.status(404).json({ 
          success: false, 
          error: 'Dificultad no encontrada' 
        });
      }
      res.json({ success: true, data: dificultad });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = getValidObjectId(req.params.id);

      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID invalido' 
        });
      }

      const result = await dificultadService.deleteDifficulty(id);
      if (!result.success) {
        return res.status(400).json({ success: false, error: result.message });
      }
      res.json({ success: true, message: result.message });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getGamesByDifficulty(req: Request, res: Response) {
    try {
      const id = getValidObjectId(req.params.id);

      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID invalido' 
        });
      }

      const juegos = await dificultadService.getGamesByDifficulty(id);
      res.json({ success: true, data: juegos });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};