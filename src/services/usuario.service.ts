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
    const foundGame = await Juego.findById(formatedIdGame);
    if (!foundGame) {
      return {
        result: false,
        statusCode: 404,
        messageState: "Juego no encontrado."
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

    //const foundGame = await
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}