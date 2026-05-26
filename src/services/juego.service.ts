import { Juego, IJuego } from '../models/juego.model';
import { JuegoCategoria, IJuegoCategoria } from '../models/juegoCategoria.model';
import { Types } from 'mongoose';
import * as ServiceTypes from "../types/servicio.types";
import * as ServiceService from "../services/servicio.service";
import { Categoria } from '../models/categoria.model';
import { Dificultad } from '../models/dificultad.model';
import { Editorial } from '../models/editorial.model';
import { UsuarioJuego } from "../models/usuariojuego.model"
import { Usuario } from "../models/usuario.model";

export class JuegoService {
  async getAllGames(): Promise<IJuego[]> {
    return await Juego.find()
      .populate('id_dificultad')
      .populate('id_editorial')
      .exec();
  }
}

export async function getGameById(idUser: string, id: string) {
  const formatedIdUser = new Types.ObjectId(idUser);
  const foundUser = await Usuario.findById(formatedIdUser);
  if (!foundUser) {
    return {
      result: false,
      statusCode: 404,
      messageState: "Usuario no encontrado."
    };
  }

  if (!Types.ObjectId.isValid(id)) {
    return {
      result: false,
      statusCode: 400,
      messageState: "Id de juego inválido."
    };
  }
  const foundGame = await Juego.findById(id)
    .populate('id_dificultad')
    .populate('id_editorial')
    .exec();
  if (!foundGame) {
    return {
      result: false,
      statusCode: 404,
      messageState: "Juego no encontrado."
    };
  }

  const formatedIdGame = new Types.ObjectId(id);
  const foundUserGame = await UsuarioJuego.findOne({
    id_usuario: formatedIdUser,
    id_juego: formatedIdGame
  });

  const flag = (foundUserGame) ? true : false;
  const gameData = foundGame.toObject() as typeof foundGame & { isFavorite: boolean };
  gameData.isFavorite = flag;

  return {
    result: true,
    statusCode: 200,
    messageState: "Juego encontrado exitosamente.",
    data: gameData
  };
}

export async function deleteGameById(id: string, justificacionRetiro: string) {
  try {
    const deletedGame = await Juego.findOneAndUpdate(
      { _id: id, activo: { $ne: false }, justificacionRetiro: null },
      { $set: { activo: false, justificacionRetiro: justificacionRetiro } },
      { new: true }
    );

    if (!deletedGame) {
      return {
        result: false,
        statusCode: 404,
        messageState: "El juego de mesa solicitado no existe o ya fue dado de baja."
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
  try {
    const foundGame = await Juego.findOne({ titulo: gameInfo.titulo });
    if (foundGame) {
      return {
        result: false,
        statusCode: 400,
        messageState: "El juego de mesa ya se encuentra registrado en el sistema."
      };
    }

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
      return {
        result: false,
        statusCode: serviceResponse.statusCode,
        messageState: serviceResponse.messageState
      };
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

export async function updateGameById(idGame: string, fieldName: string, fieldValue: string | number) {
  try {
    const formatedIdGame = new Types.ObjectId(idGame);
    const foundGame = await Juego.findOne({ _id: formatedIdGame });
    if (!foundGame) {
      return {
        result: false,
        statusCode: 400,
        messageState: "Juego no encontrado"
      };
    }

    if (fieldName === "categoria") {
      const foundCategory = await Categoria.findOne({ descripcion: fieldValue });
      if (!foundCategory) {
        return {
          result: false,
          statusCode: 400,
          messageState: "Categoria de juego no encontrada."
        };
      }
      const updatedGame = await JuegoCategoria.findOneAndUpdate(
        { _id: formatedIdGame },
        { $set: { id_categoria: foundCategory._id } },
        { new: true }
      );
      if (!updatedGame) {
        return {
          result: false,
          statusCode: 404,
          messageState: "El juego no se pudo actualizar correctamente."
        };
      }
    } else if (fieldName === "dificultad") {
      const foundDifficulty = await Dificultad.findOne({ descripcion: fieldValue });
      if (!foundDifficulty) {
        return {
          result: false,
          statusCode: 400,
          messageState: "Dificultad del juego no encontrada."
        };
      }
      const updatedGame = await Juego.findOneAndUpdate(
        { _id: formatedIdGame },
        { $set: { id_dificultad: foundDifficulty._id } },
        { new: true }
      );
      if (!updatedGame) {
        return {
          result: false,
          statusCode: 404,
          messageState: "El juego no se pudo actualizar correctamente."
        };
      }
    } else if (fieldName === "editorial") {
      const foundEditorial = await Editorial.findOne({ descripcion: fieldValue });
      if (!foundEditorial) {
        return {
          result: false,
          statusCode: 400,
          messageState: "Editorial del juego no encontrada."
        };
      }
      const updatedGame = await Juego.findOneAndUpdate(
        { _id: formatedIdGame },
        { $set: { id_editorial: foundEditorial._id } },
        { new: true }
      );
      if (!updatedGame) {
        return {
          result: false,
          statusCode: 404,
          messageState: "El juego no se pudo actualizar correctamente."
        };
      }
    } else {
      const updatedGame = await Juego.findOneAndUpdate(
        { _id: idGame },
        { $set: { [fieldName]: fieldValue } },
        { new: true }
      );
      if (!updatedGame) {
        return {
          result: false,
          statusCode: 404,
          messageState: "El juego no se pudo actualizar correctamente."
        };
      }
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "El juego se ha actualizado correctamente."
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno del servidor: ${(err as Error).message}`
    };
  }
}