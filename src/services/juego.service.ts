import { Types } from 'mongoose';
import { JuegoCategoria } from '../models/juegoCategoria.model';
import { Juego } from '../models/juego.model';
import { Categoria } from '../models/categoria.model';
import { Dificultad } from '../models/dificultad.model';
import { Editorial } from '../models/editorial.model';
import { UsuarioJuego } from "../models/usuariojuego.model"
import { Usuario } from "../models/usuario.model";
import { ServicioJuego } from '../models/servicioJuego.model';
import { Servicio } from '../models/servicio.model';
import * as ServiceTypes from "../types/servicio.types";
import * as ServiceService from "../services/servicio.service";
import * as JuegoTypes from "../types/juego.types"
import * as ReporteTypes from "../types/reporte.types";
import * as ImagenService from "../services/imagen.service";

export async function getAllGames() {
  try {
    const foundGames = await Juego.find()
      .populate('id_dificultad')
      .populate('id_editorial')
      .lean()
      .exec();
    if (!foundGames || foundGames.length === 0) {
      return {
        result: true,
        statusCode: 200,
        messageState: "No existen juegos registrados aun."
      };
    }

    const gameIds = foundGames.map(game => game._id);

    const foundGameCategories = await JuegoCategoria.find({
      id_juego: { $in: gameIds }
    }).lean();
    const foundGameServices = await ServicioJuego.find({
      id_juego: { $in: gameIds }
    }).lean();

    const categoryIds = [...new Set(foundGameCategories.map(cat => cat.id_categoria))];
    const categories = await Categoria.find({
      _id: { $in: categoryIds }
    }, "descripcion").lean();
    const serviceIds = [...new Set(foundGameServices.map(serv => serv.id_servicio))];
    const services = await Servicio.find({
      _id: { $in: serviceIds }
    }, "nombre").lean();

    const categoryMap = new Map(categories.map(cat => [cat._id.toString(), cat.descripcion]));
    const serviceMap = new Map(services.map(serv => [serv._id.toString(), serv.nombre]));

    const categoriesByGame = new Map();
    for (const gameCategory of foundGameCategories) {
      const gameId = gameCategory.id_juego.toString();
      const categoryId = gameCategory.id_categoria.toString();
      if (!categoriesByGame.has(gameId)) {
        categoriesByGame.set(gameId, []);
      }
      const category = categoryMap.get(categoryId);
      if (category) {
        categoriesByGame.get(gameId).push(category);
      }
    }

    const servicesByGame = new Map();
    for (const gameService of foundGameServices) {
      const gameId = gameService.id_juego.toString();
      const serviceId = gameService.id_servicio.toString();
      if (!servicesByGame.has(gameId)) {
        servicesByGame.set(gameId, []);
      }
      const service = serviceMap.get(serviceId);
      if (service) {
        servicesByGame.get(gameId).push(service);
      }
    }

    const gameData = [];
    for (const game of foundGames) {
      const formatedIdGame = game._id.toString();
      const gameCatecories = categoriesByGame.get(formatedIdGame) || [];
      const gameServices = servicesByGame.get(formatedIdGame) || [];
      if (gameCatecories.length === 0) {
        return {
          result: false,
          statusCode: 400,
          messageState: `El juego ${game.titulo} no tiene categorias asignadas.`
        };
      }
      if (gameServices.length === 0) {
        return {
          result: false,
          statusCode: 400,
          messageState: `El juego ${game.titulo} no tiene servicios asignados.`
        }
      }
      gameData.push({
        ...game,
        categorias: gameCatecories,
        servicios: gameServices
      });
    }

    if (!gameData || gameData.length === 0) {
      return {
        result: true,
        statusCode: 200,
        messageState: "No hay juegos registrados aun."
      };
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "Todos los juegos registrados se han obtenido correctamente.",
      data: gameData
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno del servidor: ${(err as Error).message}`
    };
  }
}

export async function getGameById(idUser: string, id: string) {
  try {
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

    const foundGameCategories = await JuegoCategoria.find({
      id_juego: formatedIdGame
    }, "id_categoria");
    if (!foundGameCategories || foundGameCategories.length === 0) {
      return {
        result: false,
        statusCode: 404,
        messageState: "El juego no tiene categorias asignadas."
      }
    }
    const categoryIds = foundGameCategories.map(cat => cat.id_categoria);
    const rawCategories = await Categoria.find({
      _id: { $in: categoryIds }
    }, "descripcion");
    const categories = rawCategories.map(rawCat => rawCat.descripcion);

    const foundGameServices = await ServicioJuego.find({
      id_juego: formatedIdGame
    }, "id_servicio");
    if (!foundGameServices || foundGameServices.length === 0) {
      return {
        result: false,
        statusCode: 404,
        messageState: "El juego no tiene categorias asignadas."
      }
    }
    const serviceIds = foundGameServices.map(serv => serv.id_servicio);
    const rawServices = await Servicio.find({
      _id: { $in: serviceIds }
    }, "nombre");
    const services = rawServices.map(rawServ => rawServ.nombre);

    const foundUserGame = await UsuarioJuego.findOne({
      id_usuario: formatedIdUser,
      id_juego: formatedIdGame
    });

    const updatedGame = await Juego.findOneAndUpdate(
      { _id: formatedIdGame },
      { $set: { visitas: foundGame.visitas + 1 } },
      { new: true }
    );
    if (!updatedGame) {
      return {
        result: false,
        statusCode: 400,
        messageState: "No se pudo actualizar el numero de visitas del juego."
      }
    }
    const flag = (foundUserGame) ? true : false;
    const gameData = updatedGame.toObject() as typeof foundGame & {
      categorias: string[],
      servicios: string[],
      isFavorite: boolean
    };
    gameData.categorias = categories;
    gameData.servicios = services;
    gameData.isFavorite = flag;
    return {
      result: true,
      statusCode: 200,
      messageState: "Juego encontrado exitosamente.",
      data: gameData
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno del servidor: ${(err as Error).message}`
    };
  }
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
    };
  }
}

export async function createGame(
  idCategory: string,
  gameInfo: JuegoTypes.IJuego,
  services: string[],
  coverImage: Express.Multer.File) {
  try {
    const foundGame = await Juego.findOne({ titulo: gameInfo.titulo });
    if (foundGame) {
      return {
        result: false,
        statusCode: 400,
        messageState: "El juego de mesa ya se encuentra registrado en el sistema."
      };
    }

    const coverImageURL = await ImagenService.uploadGameCoverImage(
      gameInfo.titulo, coverImage.buffer, coverImage.mimetype);

    const completeGameInfo = Object.assign(gameInfo, { portada: coverImageURL })
    const createdGame = await Juego.create(completeGameInfo);
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

export async function updateGameById(
  idGame: string,
  fieldName: string,
  fieldValue: string | number,
  coverImage?: Express.Multer.File) {
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

    if (coverImage) {
      const updatedCoverImageURL = await ImagenService.updateGameCoverImage(
        foundGame.titulo, coverImage.buffer, coverImage.mimetype);
      await Juego.findOneAndUpdate(
        { _id: formatedIdGame },
        { $set: { portada: updatedCoverImageURL } }
      );
    }

    if (fieldName === "categoria") {
      const foundCategory = await Categoria.findOne({ descripcion: fieldValue as string });
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
    }  else {
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

export async function getMostRecentGames() {
  try {
    const today = new Date();
    const recentLimit = new Date(today.getMonth() - 1);

    const foundGames = await Juego.find({
      createdAt: { $gte: recentLimit }
    }, "_id titulo descripcion durecion_min duracion_max precio disponible activo portada");
    if (!foundGames || foundGames.length === 0) {
      return {
        result: true,
        statusCode: 200,
        messageState: "No hay juegos recientemente registrados."
      };
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "Juegos recientemente registrados obtenidos correctamente",
      data: foundGames
    }
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno del servidor: ${(err as Error).message}`
    };
  }
}

export async function handleMostGames(
  allGames: boolean,
  order: string,
  action: "visited" | "selled" | "borrowed",
  amount?: number) {
  try {
    let magicWord;
    let sortCondition;
    let atribute;
    if (action === "visited") {
      sortCondition = (order === ReporteTypes.Ordenamiento.ASCENDENTE)
        ? { visitas: 1 as const }
        : { visitas: -1 as const }
      magicWord = "visitados";
      atribute = "visitas";
    } else if (action === "selled") {
      sortCondition = (order === ReporteTypes.Ordenamiento.ASCENDENTE)
        ? { ventas: 1 as const }
        : { ventas: -1 as const }
      magicWord = "vendidos";
      atribute = "ventas";
    } else {
      sortCondition = (order === ReporteTypes.Ordenamiento.ASCENDENTE)
        ? { prestamos: 1 as const }
        : { prestamos: -1 as const }
      magicWord = "prestados"
      atribute = "prestamos"
    }

    const foundGames = await Juego.find({
    }, `_id titulo descripcion durecion_min duracion_max precio disponible activo ${atribute}`)
      .sort(sortCondition);
    if (!foundGames || foundGames.length === 0) {
      return {
        result: true,
        statusCode: 200,
        messageState: "No hay juegos que hayan tenido visitas."
      };
    }

    let formatedGames;
    if (allGames && amount) {
      if (amount < 0 || amount > foundGames.length) {
        return {
          result: false,
          statusCode: 400,
          messageState: "Cantidad invalida."
        };
      }
      formatedGames = foundGames.slice(0, amount);
    } else {
      formatedGames = foundGames;
    }
    const message = (amount)
      ? `Los primeros ${amount} juegos mas ${magicWord} se han obtenido correctamente.`
      : `Juegos mas ${magicWord} obtenidos correctamente.`
    return {
      result: true,
      statusCode: 200,
      messageState: message,
      data: formatedGames
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno del servidor: ${(err as Error).message}`
    };
  }
}

export async function getMostVisitedGames(allGames: boolean, order: string, amount?: number) {
  return await handleMostGames(allGames, order, "visited", amount);
}

export async function getMostSelledGames(allGames: boolean, order: string, amount?: number) {
  return await handleMostGames(allGames, order, "selled", amount);
}

export async function getMostBorrowedGames(allGames: boolean, order: string, amount?: number) {
  return await handleMostGames(allGames, order, "borrowed", amount);
}