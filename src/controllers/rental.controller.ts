import { Request, Response } from 'express';
import * as RentalService from '../services/rental.service';

export async function createRental(req: Request, res: Response) {
  try {
    const { game_id, start_date, return_date } = req.body;

    if (!game_id || !start_date || !return_date) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty parameters. game_id, start_date and return_date are required."
      });
    }

    const { result, statusCode, messageState, data } = await RentalService.createRental({
      game_id,
      start_date,
      return_date
    });

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
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${(err as Error).message}`
    });
  }
}

export async function getRentalsByGame(req: Request, res: Response) {
  try {
    const { game_id } = req.query;

    if (!game_id || typeof game_id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty game ID."
      });
    }

    const { result, statusCode, messageState, data } = await RentalService.getRentalsByGame(game_id);

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
      message: `Internal server error: ${(err as Error).message}`
    });
  }
}

export async function cancelRental(req: Request, res: Response) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty rental ID."
      });
    }

    const { result, statusCode, messageState, data } = await RentalService.cancelRental(id);

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
      message: `Internal server error: ${(err as Error).message}`
    });
  }
}
