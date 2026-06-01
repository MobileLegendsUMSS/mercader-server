import { Types } from "mongoose";
import { Juego } from "../models/juego.model";
import { Resena } from "../models/resena.model";
import { ResenaJuego } from "../models/resenaJuego.model";
import { Usuario } from "../models/usuario.model";
import * as ResenaTypes from "../types/resena.types";

export async function getReviewsByGame(gameId: string) {
  try {
    const juego = await Juego.findById(gameId);
    if (!juego) {
      return {
        result: false,
        statusCode: 404,
        messageState: "Juego no encontrado",
        data: null
      };
    }

    const relaciones = await ResenaJuego.find({ id_juego: new Types.ObjectId(gameId) });
    
    if (relaciones.length === 0) {
      return {
        result: true,
        statusCode: 200,
        messageState: "No hay reseñas para este juego",
        data: []
      };
    }

    const resenasConUsuario = await Promise.all(
      relaciones.map(async (relacion) => {
        const resena = await Resena.findById(relacion.id_resena);
        if (!resena) return null;
        
        const usuario = await Usuario.findById(resena.id_usuario);
        
        return {
          id_resena: resena._id.toString(),
          rating: resena.rating,
          content: resena.content,
          timestamp: resena.timestamp,
          usuario: {
            id: usuario?._id.toString() || "",
            nombre: usuario?.nombre || "Usuario eliminado"
          }
        };
      })
    );

    const resenasValidas = resenasConUsuario.filter(r => r !== null);

    return {
      result: true,
      statusCode: 200,
      messageState: "Reseñas obtenidas correctamente",
      data: resenasValidas
    };
  } catch (err) {
    console.error("Error en getReviewsByGame:", err);
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`,
      data: null
    };
  }
}

export async function createReview(
  userId: string,
  gameId: string,
  rating: number,
  content: string
) {
  try {
    // Validar rating
    if (!rating || rating < 1 || rating > 5) {
      return {
        result: false,
        statusCode: 400,
        messageState: "La calificación debe ser entre 1 y 5 estrellas",
        data: null
      };
    }

    // Validar contenido
    if (!content || content.length < 10 || content.length > 500) {
      return {
        result: false,
        statusCode: 400,
        messageState: "El contenido de la reseña debe tener entre 10 y 500 caracteres",
        data: null
      };
    }

    const juego = await Juego.findById(gameId);
    if (!juego) {
      return {
        result: false,
        statusCode: 404,
        messageState: "Juego no encontrado",
        data: null
      };
    }

    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return {
        result: false,
        statusCode: 404,
        messageState: "Usuario no encontrado",
        data: null
      };
    }

    // Verificar si el usuario ya escribió una reseña para este juego
    const relacionesExistentes = await ResenaJuego.find({ id_juego: new Types.ObjectId(gameId) });
    
    for (const relacion of relacionesExistentes) {
      const resenaExistente = await Resena.findById(relacion.id_resena);
      if (resenaExistente && resenaExistente.id_usuario.toString() === userId) {
        return {
          result: false,
          statusCode: 409,
          messageState: "Ya has escrito una reseña para este juego",
          data: null
        };
      }
    }

    // Crear la reseña con rating
    const nuevaResena = new Resena({
      id_usuario: new Types.ObjectId(userId),
      rating: rating,
      content: content.trim(),
      timestamp: Date.now()
    });

    await nuevaResena.save();

    const nuevaRelacion = new ResenaJuego({
      id_resena: nuevaResena._id,
      id_juego: new Types.ObjectId(gameId)
    });

    await nuevaRelacion.save();

    return {
      result: true,
      statusCode: 200,
      messageState: "Reseña creada exitosamente",
      data: {
        id_resena: nuevaResena._id.toString(),
        rating: nuevaResena.rating,
        content: nuevaResena.content,
        timestamp: nuevaResena.timestamp,
        usuario: {
          id: usuario._id.toString(),
          nombre: usuario.nombre
        }
      }
    };
  } catch (err) {
    console.error("Error en createReview:", err);
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`,
      data: null
    };
  }
}