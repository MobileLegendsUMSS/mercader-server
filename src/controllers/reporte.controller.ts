import { Request, Response } from "express";
import * as TokenTypes from "../types/token.types";
import * as ReportesTypes from "../types/reporte.types";
import * as ReportesService from "../services/reporte.service";

export async function getTop5MostUsedGamesByUser(req: Request, res: Response) {
  try {
    const { id_usuario } = req.user as TokenTypes.TokenPayload;

    if (!id_usuario || typeof id_usuario !== "string") {
      return res.status(400).json({
        success: false,
        message: "Id de usuario invalido."
      });
    }

    const { result, statusCode, messageState, data } = await ReportesService.getTop5MostUsedGamesByUser(id_usuario);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    if (!data || data.length === 0) {
      return res.status(200).json({
        success: true,
        message: "El usuario no tiene prestamos vigentes registrados."
      });
    }
    return res.status(200).json({
      success: true,
      message: "Prestamos del usuario obtenidos exitosamente.",
      data: data
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error interno del servidor: ${(err as Error).message}`
    });
  }
}

export async function getGamesByStock(req: Request, res: Response) {
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
    if (!Object.values(ReportesTypes.Ordenamiento).includes(order as ReportesTypes.Ordenamiento)) {
      return res.status(400).json({
        result: false,
        message: "Parametro de ordenamiento de juegos invalido."
      });
    }
    if (allGames === false) {
      if (amount || typeof amount !== "number") {
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

    const { result, statusCode, messageState, data } = await ReportesService.getGamesByStock(allGames, order, amount);
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

export async function getCategoryPopularity(req: Request, res: Response) {
  try {
    const { result, statusCode, messageState, data } = await ReportesService.getCategiryPopularity();
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

export async function handlePerPeriod(
  req: Request,
  res: Response,
  action: "sells" | "borrows") {
  try {
    const { timePeriod, timeValue } = req.body;

    if (!timePeriod || typeof timePeriod !== "string") {
      return res.status(400).json({
        success: false,
        message: "Periodo de tiempo invalido."
      });
    }
    if (!Object.values(ReportesTypes.PeriodoTiempo).includes(timePeriod as ReportesTypes.PeriodoTiempo)) {
      return res.status(400).json({
        result: false,
        message: "Periodo de tiempo invalido."
      });
    }
    if (!timeValue) {
      return res.status(400).json({
        result: false,
        message: "Fecha de reporte invalida."
      });
    }

    let ans;
    if (action === "sells") {
      ans = await ReportesService.getIncomePerPeriod(timePeriod, timeValue);
    } else {
      ans = await ReportesService.getBorrowsPerPeriod(timePeriod, timeValue);
    }

    const { result, statusCode, messageState, data } = ans;
    if (!result) {
      return res.status(statusCode).json({
        success: false,
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

export async function getIncomePerPeriod(req: Request, res: Response) {
  return await handlePerPeriod(req, res, "sells");
}

export async function getBorrowsPerPeriod(req: Request, res: Response){
  return await handlePerPeriod(req, res, "borrows");
}