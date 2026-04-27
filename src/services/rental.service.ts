import { Rental } from '../models/rental.model';
import { Juego } from '../models/juego.model';
import { Types } from 'mongoose';

export async function createRental(data: { game_id: string; start_date: string; return_date: string }) {
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

    if (!game.disponible || game.cantidad <= 0) {
      return {
        result: false,
        statusCode: 400,
        messageState: "The game is not available for rental."
      };
    }

    const rental = await Rental.create({
      game_id: new Types.ObjectId(data.game_id),
      start_date: new Date(data.start_date),
      return_date: new Date(data.return_date),
      status: 'active',
      active: true
    });

    await Juego.findByIdAndUpdate(data.game_id, { $inc: { cantidad: -1 } });

    return {
      result: true,
      statusCode: 201,
      messageState: "Rental created successfully.",
      data: rental
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Internal server error: ${(err as Error).message}`
    };
  }
}

export async function getRentalsByGame(gameId: string) {
  try {
    if (!Types.ObjectId.isValid(gameId)) {
      return {
        result: false,
        statusCode: 400,
        messageState: "Invalid game ID."
      };
    }

    const rentals = await Rental.find({ game_id: new Types.ObjectId(gameId), active: true })
      .populate('game_id')
      .exec();

    return {
      result: true,
      statusCode: 200,
      messageState: "Rentals found successfully.",
      data: rentals
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Internal server error: ${(err as Error).message}`
    };
  }
}

export async function cancelRental(id: string) {
  try {
    if (!Types.ObjectId.isValid(id)) {
      return {
        result: false,
        statusCode: 400,
        messageState: "Invalid rental ID."
      };
    }

    const rental = await Rental.findById(id).exec();
    if (!rental) {
      return {
        result: false,
        statusCode: 404,
        messageState: "The requested rental does not exist."
      };
    }

    rental.status = 'cancelled';
    rental.active = false;
    await rental.save();

    await Juego.findByIdAndUpdate(rental.game_id, { $inc: { cantidad: 1 } });

    return {
      result: true,
      statusCode: 200,
      messageState: "Rental cancelled successfully.",
      data: rental
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Internal server error: ${(err as Error).message}`
    };
  }
}
