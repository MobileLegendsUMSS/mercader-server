import { Request, Response } from 'express';
import * as ReservationService from '../services/reservation.service';

export async function createReservation(req: Request, res: Response) {
  try {
    const { game_id, date, time } = req.body;

    if (!game_id || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty parameters. game_id, date and time are required."
      });
    }

    const { result, statusCode, messageState, data } = await ReservationService.createReservation({
      game_id,
      date,
      time
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

export async function getReservationsByGame(req: Request, res: Response) {
  try {
    const { game_id } = req.query;

    if (!game_id || typeof game_id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty game ID."
      });
    }

    const { result, statusCode, messageState, data } = await ReservationService.getReservationsByGame(game_id);

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

export async function cancelReservation(req: Request, res: Response) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty reservation ID."
      });
    }

    const { result, statusCode, messageState, data } = await ReservationService.cancelReservation(id);

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
