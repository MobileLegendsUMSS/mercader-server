import { Reserva } from '../models/reserva.model';
import { Juego } from '../models/juego.model';
import { Types } from 'mongoose';

export async function createReservation(data: { game_id: string; date: string; time: string }) {
  try {
    if (!Types.ObjectId.isValid(data.game_id)) {
      return {
        result: false,
        statusCode: 400,
        messageState: "Invalid game ID."
      };
    }

    const game = await Juego.findById(data.game_id);
    if (!game) {
      return {
        result: false,
        statusCode: 404,
        messageState: "The requested game does not exist."
      };
    }

    if (!game.disponible) {
      return {
        result: false,
        statusCode: 400,
        messageState: "The game is not available for reservation."
      };
    }

    const reservation = await Reserva.create({
      id_juego: new Types.ObjectId(data.game_id),
      fecha_reserva: new Date(data.date),
      hora_reserva: data.time,
      estado: 'pendiente',
      activo: true
    });

    return {
      result: true,
      statusCode: 201,
      messageState: "Reservation created successfully.",
      data: reservation
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Internal server error: ${(err as Error).message}`
    };
  }
}

export async function getReservationsByGame(gameId: string) {
  try {
    if (!Types.ObjectId.isValid(gameId)) {
      return {
        result: false,
        statusCode: 400,
        messageState: "Invalid game ID."
      };
    }

    const reservations = await Reserva.find({ id_juego: new Types.ObjectId(gameId), activo: true })
      .populate('id_juego')
      .exec();

    return {
      result: true,
      statusCode: 200,
      messageState: "Reservations found successfully.",
      data: reservations
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Internal server error: ${(err as Error).message}`
    };
  }
}

export async function cancelReservation(id: string) {
  try {
    if (!Types.ObjectId.isValid(id)) {
      return {
        result: false,
        statusCode: 400,
        messageState: "Invalid reservation ID."
      };
    }

    const reservation = await Reserva.findByIdAndUpdate(
      id,
      { $set: { estado: 'cancelada', activo: false } },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return {
        result: false,
        statusCode: 404,
        messageState: "The requested reservation does not exist."
      };
    }

    return {
      result: true,
      statusCode: 200,
      messageState: "Reservation cancelled successfully.",
      data: reservation
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Internal server error: ${(err as Error).message}`
    };
  }
}
