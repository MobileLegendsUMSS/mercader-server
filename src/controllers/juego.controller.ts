import { Request, Response } from 'express';
import { JuegoService } from '../services/juego.service';
import * as ServiceTypes from "../types/servicio.types";
import * as TokenTypes from "../types/token.types";
import * as GameTypes from "../types/juego.types";
import * as ReporteTypes from "../types/reporte.types";
import * as GameService from "../services/juego.service";

const juegoService = new JuegoService();

interface ParamsDictionary {
  id: string;
}

export const juegoController = {

  async getAllGames(req: Request, res: Response) {
    try {
      const juegos = await juegoService.getAllGames();
      res.json({ success: true, data: juegos });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

};

export async function getGameById(req: Request, res: Response) {
  try {
    const { id_usuario } = req.user as TokenTypes.TokenPayload;
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: 'Id de juego invalido.'
      });
    }
    const { result, statusCode, messageState, data } = await GameService.getGameById(id_usuario, id);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Juego no encontrado"
      });
    }
    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

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
    const { services, ...gameInfo } = req.body;

    if (!idCategory || typeof idCategory !== "string") {
      return res.status(400).json({
        success: false,
        message: "Categoria Invalida."
      });
    }
    if (!Array.isArray(services) || services.length === 0 ||
      !services.every(s => typeof s === "string" &&
        Object.values(ServiceTypes.TipoServicio).includes(s as ServiceTypes.TipoServicio))) {
      return res.status(400).json({
        success: false,
        message: "Falta catalogar el juego con algun servicio"
      });
    }
    if (!gameInfo || Object.keys(gameInfo).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Informacion del juego invalida o incompleta."
      });
    }

    const formatedServices = services as string[]
    const { result, statusCode, messageState, data } = await GameService.createGame(idCategory, gameInfo, formatedServices);
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
      success: false,
      message: `Error interno del servidor: ${(err as Error).message}`
    });
  }
}

export async function updateGameById(req: Request, res: Response) {
  try {
    const { id_juego } = req.query;
    const { fieldName, fieldValue } = req.body;

    if ((!id_juego || typeof id_juego !== "string") ||
      (!fieldName || typeof fieldName !== "string")) {
      return res.status(400).json({
        success: false,
        message: "Id de juego o nombre de campo invalido."
      });
    }
    if (!GameTypes.stringFields.includes(fieldName as keyof GameTypes.GameStringItems) &&
      !GameTypes.numericFields.includes(fieldName as keyof GameTypes.GameNumericItems)) {
      return res.status(400).json({
        success: false,
        message: "Nombre del campo invalido."
      });
    }
    if (GameTypes.stringFields.includes(fieldName as keyof GameTypes.GameStringItems) && typeof fieldValue !== 'string') {
      return res.status(400).json({
        success: false,
        message: "El campo requiere un valor de texto."
      });
    }
    if (GameTypes.numericFields.includes(fieldName as keyof GameTypes.GameNumericItems) && typeof fieldValue !== 'number') {
      return res.status(400).json({
        success: false,
        message: "El campo requiere un valor numerico."
      });
    }

    const { result, statusCode, messageState } = await GameService.updateGameById(id_juego, fieldName, fieldValue);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    return res.status(200).json({
      success: true,
      message: "El juego se ha actualizado correctamente."
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error interno del servidor: ${(err as Error).message}`
    });
  }
}

export async function getMostRecentGames(req: Request, res: Response) {
  try {
    const { result, statusCode, messageState, data } = await GameService.getMostRecentGames();
    if (!data) {
      return res.status(statusCode).json({
        success: result,
        message: messageState
      });
    }
    return res.status(200).json({
      success: true,
      message: "Juegos recientemente registrados obtenidos correctamente",
      data: data
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error interno del servidor: ${(err as Error).message}`
    });
  }
}

export async function handleMostGames(
  req: Request,
  res: Response,
  action: "visited" | "selled" | "borrowed") {
  try {
    const { allGames, order, amount = null } = req.body;

    if (allGames === null || allGames === undefined || typeof allGames !== "boolean") {
      return res.status(400).json({
        result: false,
        message: "Parametro de muestreo de juegos invalido."
      });
    }
    if (!order || typeof order !== "string") {
      return res.status(400).json({
        result: false,
        message: "Parametro de ordenamiento de juegos invalido."
      });
    }
    if (!Object.values(ReporteTypes.Ordenamiento).includes(order as ReporteTypes.Ordenamiento)) {
      return res.status(400).json({
        result: false,
        message: "Parametro de ordenamiento de juegos invalido."
      });
    }
    if (allGames === false) {
      if (!amount || typeof amount !== "number") {
        return res.status(400).json({
          result: false,
          message: "Cantidad de juegos mas visitados invalida."
        });
      }
    } else {
      if (amount) {
        return res.status(400).json({
          result: false,
          message: "Parametros invalidos."
        });
      }
    }

    let ans;
    if (action === "visited") {
      ans = await GameService.getMostVisitedGames(allGames, order, amount);
    } else if (action === "selled") {
      ans = await GameService.getMostSelledGames(allGames, order, amount);
    } else {
      ans = await GameService.getMostBorrowedGames(allGames, order, amount);
    }

    const { result, statusCode, messageState, data } = ans;
    if (!data) {
      return res.status(statusCode).json({
        success: result,
        message: messageState
      });
    }
    return res.status(200).json({
      success: true,
      message: messageState,
      data: data
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error interno del servidor: ${(err as Error).message}`
    });
  }
}

export async function getMostVisitedGames(req: Request, res: Response) {
  return await handleMostGames(req, res, "visited");
}

export async function getMostSelledGames(req: Request, res: Response) {
  return await handleMostGames(req, res, "selled");
}

export async function getMostBorrowedGames(req: Request, res: Response) {
  return await handleMostGames(req, res, "borrowed");
}