import { Request, Response } from 'express';
import { JuegoService } from '../services/juego.service';
import * as GameService from "../services/juego.service";
import { Types } from 'mongoose'
import { IJuego } from '../models/juego.model';

const juegoService = new JuegoService();

interface ParamsDictionary {
  id: string;
}

interface UpdateGameBody {
    titulo?: string;
    descripcion?: string;
    tutorial?: string;
    cant_min_pers?: number;
    cant_max_pers?: number;
    duracion_min?: number;
    duracion_max?: number;
    precio?: number;
    imagen?: string;
    categorias?: string[]; // Array de IDs de categorías
}

export const juegoController = {
  //async create(req: Request, res: Response) {
  //  try {
  //    const juego = await juegoService.createGame(req.body);
  //    res.status(201).json({ success: true, data: juego });
  //  } catch (error: any) {
  //    res.status(400).json({ success: false, error: error.message });
  //  }
  //},

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
  },

  async updateGame(req: Request<ParamsDictionary, {}, UpdateGameBody>, res: Response) {
        try {
            const { id } = req.params;
            const {
                titulo,
                descripcion,
                tutorial,
                cant_min_pers,
                cant_max_pers,
                duracion_min,
                duracion_max,
                precio,
                imagen,
                categorias
            } = req.body;

            // Validar que al menos un campo viene para actualizar
            if (!titulo && !descripcion && !tutorial && !cant_min_pers && 
                !cant_max_pers && !duracion_min && !duracion_max && 
                !precio && !imagen && !categorias) {
                return res.status(400).json({
                    success: false,
                    message: "Debe proporcionar al menos un campo para actualizar"
                });
            }

            // Construir objeto con solo los campos que vienen en la petición
            const updateData: Partial<IJuego> = {};
            if (titulo !== undefined) updateData.titulo = titulo;
            if (descripcion !== undefined) updateData.descripcion = descripcion;
            if (tutorial !== undefined) updateData.tutorial = tutorial;
            if (cant_min_pers !== undefined) updateData.cant_min_pers = cant_min_pers;
            if (cant_max_pers !== undefined) updateData.cant_max_pers = cant_max_pers;
            if (duracion_min !== undefined) updateData.duracion_min = duracion_min;
            if (duracion_max !== undefined) updateData.duracion_max = duracion_max;
            if (precio !== undefined) updateData.precio = precio;
            if (imagen !== undefined) updateData.imagen = imagen;

            // Validar categorías si se envían
            if (categorias && (!Array.isArray(categorias) || categorias.length === 0)) {
                return res.status(400).json({
                    success: false,
                    message: "Las categorías deben ser un array no vacío"
                });
            }

            // Validar IDs de categorías si se envían
            if (categorias) {
                for (const catId of categorias) {
                    if (!Types.ObjectId.isValid(catId)) {
                        return res.status(400).json({
                            success: false,
                            message: `ID de categoría inválido: ${catId}`
                        });
                    }
                }
            }

            const { result, statusCode, messageState, data } = await juegoService.updateGame(
                id, 
                updateData, 
                categorias
            );

            if (!result) {
                return res.status(statusCode).json({
                    success: false,
                    message: messageState
                });
            }

            return res.status(statusCode).json({
                success: true,
                message: messageState,
                data: data
            });

        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: `Error interno del servidor: ${error.message}`
            });
        }
    }
};

export async function deleteGameById(req: Request, res: Response) {
  try {
    const { id } = req.query;
    const { justificacionRetiro } = req.body;

    if (!id || typeof id !== "string" ||
      !justificacionRetiro || typeof justificacionRetiro !== "string") {
      return res.status(400).json({
        success: false,
        message: "Parametros invalidos o vacios."
      });
    }
    
    const { result, statusCode, messageState, deletedGame } = await GameService.deleteGameById(id, justificacionRetiro);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    return res.status(200).json({
      success: true,
      message: "El juego solicitado ha sido eliminado.",
      data: deletedGame
    });
  } catch (err) {
    return res.status(500).json({
      result: false,
      message: `Error interno del servidor: ${(err as Error).message}`   
    });
  }
}

export async function createGame(req: Request, res: Response) {
  try {
    const { idCategory } = req.query;
    const gameInfo = req.body;

    if (!idCategory || typeof idCategory !== "string") {
      return res.status(400).json({
        success: false,
        message: "Categoria Invalida."
      });
    }
    if (!gameInfo || Object.keys(gameInfo).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Informacion del juego invalida o incompleta."
      });
    }

    const { result, statusCode, messageState, data} = await GameService.createGame(idCategory, gameInfo);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    return res.status(200).json({
      success: true,
      message: "El juego se ha creado exitosamente",
      data: data
    });
  } catch (err) {
    return res.status(500).json({
      result: false,
      message: `Error interno del servidor: ${(err as Error).message}`
    });
  }
}