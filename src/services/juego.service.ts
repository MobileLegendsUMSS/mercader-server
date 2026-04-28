import mongoose, { ObjectId, Types } from 'mongoose';
import { Juego, IJuego } from '../models/juego.model';
import { JuegoCategoria, IJuegoCategoria } from '../models/juegoCategoria.model';

export class JuegoService {
    //async createGame(data: Partial<IJuego>): Promise<IJuego> {
    //  const juego = new Juego(data);
    //  return await juego.save();
  //}
  async updateGame(
    id: string, 
    updateData: Partial<IJuego>, 
    categoriasIds?: string[]
  ): Promise<any> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
      // Validar que el juego existe
      if (!Types.ObjectId.isValid(id)) {
          return {
              result: false,
              statusCode: 400,
              messageState: "ID de juego inválido"
          };
      }

      // Validar que al menos se envía un campo para actualizar
      if (!updateData || Object.keys(updateData).length === 0) {
          return {
              result: false,
              statusCode: 400,
              messageState: "No se enviaron datos para actualizar"
          };
      }

      // Validar rangos si se actualizan
      if (updateData.cant_min_pers && updateData.cant_max_pers) {
          if (updateData.cant_max_pers < updateData.cant_min_pers) {
              return {
                  result: false,
                  statusCode: 400,
                  messageState: "La cantidad máxima debe ser mayor o igual a la mínima"
              };
          }
      }

      if (updateData.duracion_min && updateData.duracion_max) {
          if (updateData.duracion_max < updateData.duracion_min) {
              return {
                  result: false,
                  statusCode: 400,
                  messageState: "La duración máxima debe ser mayor o igual a la mínima"
              };
          }
      }

      // Actualizar el juego
      const updatedGame = await Juego.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true, session }
      );

      if (!updatedGame) {
          await session.abortTransaction();
          session.endSession();
          return {
              result: false,
              statusCode: 404,
              messageState: "El juego no existe"
          };
      }

      // Si se enviaron categorías, actualizar las relaciones
      if (categoriasIds && categoriasIds.length > 0) {
          // Eliminar todas las relaciones existentes
          await JuegoCategoria.deleteMany(
              { id_juego: new Types.ObjectId(id) },
              { session }
          );

          // Crear nuevas relaciones
          const nuevasRelaciones = categoriasIds.map(catId => ({
              id_juego: new Types.ObjectId(id),
              id_categoria: new Types.ObjectId(catId)
          }));

          await JuegoCategoria.insertMany(nuevasRelaciones, { session });
      }

      await session.commitTransaction();
      session.endSession();

      // Obtener el juego actualizado con sus categorías
      const juegoConCategorias = await Juego.findById(id)
          .populate('id_dificultad')
          .populate('id_editorial')
          .exec();

      const categorias = await JuegoCategoria.find({ id_juego: new Types.ObjectId(id) })
          .populate('id_categoria')
          .exec();

      return {
          result: true,
          statusCode: 200,
          messageState: "Juego actualizado correctamente",
          data: {
              juego: juegoConCategorias,
              categorias: categorias.map(c => c.id_categoria)
          }
      };

  } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return {
          result: false,
          statusCode: 500,
          messageState: `Error interno del servidor: ${(err as Error).message}`
      };
  }
}

  
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

export async function createGame(idCategory: string, gameInfo: Partial<IJuego>) {
  try{
    const createdGame = await Juego.create(gameInfo);
    if (!createdGame) {
      return {
        result: false,
        statusCode: 400,
        messageState: "El juego no se pudo crear correctamente"
      };
    }
    
    const id_juego = new Types.ObjectId(createdGame._id);
    const id_categoria = idCategory;
    const newGameCategory = { id_juego, id_categoria };
    const createdGameCategory = await JuegoCategoria.create(newGameCategory);
    if (!createdGameCategory) {
      return {
        result: false,
        statusCode: 400,
        messageState: "El juego no se pudo crear correctamente"
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