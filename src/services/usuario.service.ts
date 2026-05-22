import { Types } from "mongoose";
import { Usuario } from "../models/usuario.model";
import { Juego } from "../models/juego.model";
import { UsuarioJuego } from "../models/usuariojuego.model";
import * as UsuarioTypes from "../types/usuario.types";

export async function getPersonalInfo(idUser: string) {
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

    const data = {
      nombre: foundUser.nombre,
      telefono: foundUser.telefono,
      correo_contacto: foundUser.correo_contacto,
      mercapoints: foundUser.mercapoints
    };
    if (foundUser.nombres) {
      Object.assign(data, { nombres: foundUser.nombres });
    }
    if (foundUser.apellidos) {
      Object.assign(data, { apellidos: foundUser.apellidos });
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "Los datos personales del usuario se han obtenido correctamente.",
      data: data
    }
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}

export async function updatePersonalInfo(idUser: string, personalInfo: UsuarioTypes.SigninPayload) {
  try {
    const {
      nombres = null,
      apellidos = null,
      telefono = null,
      correo_contacto = null
    } = personalInfo;

    const formatedIdUser = new Types.ObjectId(idUser);
    const foundUser = await Usuario.findById(formatedIdUser);
    if (!foundUser) {
      return {
        result: false,
        statusCode: 404,
        messageState: "Usuario no encontrado."
      };
    }

    let updateCondition = {};
    if (nombres) {
      Object.assign(updateCondition, { nombres: nombres });
    }
    if (apellidos) {
      Object.assign(updateCondition, { apellidos: apellidos });
    }
    if (telefono) {
      Object.assign(updateCondition, { telefono: telefono });
    }
    if (correo_contacto) {
      Object.assign(updateCondition, { correo_contacto: correo_contacto });
    }
    const updatedPersonalInfo = await Usuario.findOneAndUpdate(
      { _id: formatedIdUser },
      { $set: updateCondition },
      { new: true }
    );
    if (!updatedPersonalInfo) {
      return {
        result: false,
        statusCode: 400,
        messageState: "La informacion del usuario no se pudo actualizar correctamente."
      };
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "La informacion del usuario se ha actualizado correctamente."
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}

export async function registerFavoriteGame(idUser: string, idGame: string) {
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

    const formatedIdGame = new Types.ObjectId(idGame);
    const foundGame = await Juego.findOne({
      _id: formatedIdGame,
      activo: true,
    });
    if (!foundGame) {
      return {
        result: false,
        statusCode: 404,
        messageState: "Juego no encontrado."
      };
    }

    const foundUserGame = await UsuarioJuego.findOne({
      id_usuario: formatedIdUser,
      id_juego: formatedIdGame
    });
    if (foundUserGame) {
      return {
        result: false,
        statusCode: 400,
        messageState: "El juego ya esta marcado como favorito."
      };
    }

    const newUserGame = { id_usuario: formatedIdUser, id_juego: formatedIdGame };
    const createdUserGame = await UsuarioJuego.create(newUserGame);
    if (!createdUserGame) {
      return {
        result: false,
        statusCode: 400,
        messageState: "El juego no se pudo registrar como favorito."
      };
    }
    return {
      result: true,
      statusCode: 201,
      messageState: "El juego se ha agregado a favoritos correctamente."
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}

export async function getFavoriteGames(idUser: string) {
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

    const foundUserGame = await UsuarioJuego.find({
      id_usuario: formatedIdUser
    }, "id_juego");
    if (!foundUserGame || foundUserGame.length === 0) {
      return {
        result: true,
        statusCode: 200,
        messageState: "El usuario no tiene juegos favoritos."
      };
    }

    const data = [];
    for (const userGame of foundUserGame) {
      const foundGame = await Juego.findOne({
        _id: userGame.id_juego,
        activo: true
      });
      if (!foundGame) {
        return {
          result: false,
          statusCode: 404,
          messageState: "Un juego que se marcado como favorito no exite."
        };
      }
      const gameInfo = {
        titlo: foundGame.titulo,
        descripcion: foundGame.descripcion,
        cant_min_pers: foundGame.cant_min_pers,
        cant_max_pers: foundGame.cant_max_pers,
        duracion_min: foundGame.duracion_min,
        duracion_max: foundGame.duracion_max,
        precio: foundGame.precio,
        disponible: foundGame.disponible
      };
      data.push(gameInfo);
    }
    if (!data || data.length === 0) {
      return {
        result: false,
        statusCode: 400,
        messageState: "Error al recopilar informacion de juegos favoritos."
      };
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "Los juegos favoritos del usuario se han obtenido correctamente.",
      data: data
    }
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}

export async function deleteFavoriteGame(idUser: string, idGame: string) {
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

    const formatedIdGame = new Types.ObjectId(idGame);
    const foundGame = await Juego.findOne({
      _id: formatedIdGame,
      activo: true,
    });
    if (!foundGame) {
      return {
        result: false,
        statusCode: 404,
        messageState: "Juego no encontrado."
      };
    }

    const foundUserGame = await UsuarioJuego.findOne({
      id_usuario: formatedIdUser,
      id_juego: formatedIdGame
    });
    if (!foundUserGame) {
      return {
        result: false,
        statusCode: 404,
        messageState: "El usuario no tiene el juego consultado como favorito."
      };
    }
    const deletedUserGame = await UsuarioJuego.findOneAndDelete({
      id_usuario: formatedIdUser,
      id_juego: formatedIdGame
    });
    if (!deletedUserGame) {
      return {
        result: false,
        statusCode: 400,
        messageState: "El juego no se pudo desmarcar como favorito."
      };
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "El juego se ha quitado de favoritos correctamente."
    }
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}