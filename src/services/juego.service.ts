import { ObjectId } from 'mongoose';
import { Juego, IJuego } from '../models/juego.model';
import { JuegoCategoria, IJuegoCategoria } from '../models/juegoCategoria.model';
import { Types } from 'mongoose';
import * as ServiceTypes from "../types/servicio.types";
import * as ServiceService from "../services/servicio.service";

export class JuegoService {
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

export async function deleteGameById(id: string, justificacionRetiro: string) {
  try {
    const deletedGame = await Juego.findByIdAndUpdate(
      id,
      { $set: { activo: false, justificacionRetiro: justificacionRetiro } },
      { new: true, runValidators: true }
    );

    if (!deletedGame) {
      return {
        result: false,
        statusCode: 404,
        messageState: "El juego de mesa solicitado no existe."
      };
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "El juego solicitado ha sido dado de baja correctamente.",
      deletedGame: deletedGame
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno del servidor: ${(err as Error).message}`
    }
  }
}

export async function createGame(idCategory: string, gameInfo: Partial<IJuego>, services: string[]) {
  try{
    const createdGame = await Juego.create(gameInfo);
    if (!createdGame) {
      return {
        result: false,
        statusCode: 400,
        messageState: "El juego no se pudo crear correctamente"
      };
    }
    
    const idGame = new Types.ObjectId(createdGame._id);
    const newGameCategory = { id_juego: idGame, id_categoria: idCategory };
    const createdGameCategory = await JuegoCategoria.create(newGameCategory);
    if (!createdGameCategory) {
      return {
        result: false,
        statusCode: 400,
        messageState: "El juego no se pudo crear correctamente"
      };
    }

    const formatedServices = services as ServiceTypes.TipoServicio[];
    const serviceResponse = await ServiceService.registerService(idGame, formatedServices);
    if (!serviceResponse.result) {
      return serviceResponse;
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "El juego se ha creado correctamente.",
      data: createdGame
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno del servidor: ${(err as Error).message}`
    };
  }
}