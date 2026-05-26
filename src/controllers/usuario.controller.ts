import { Request, Response } from "express";
import * as RegexConstants from "../utils/regex.constants";
import * as TokenTypes from "../types/token.types";
import * as UsuarioTypes from "../types/usuario.types";
import * as UsuarioService from "../services/usuario.service";

export async function getPersonalInfo(req: Request, res: Response) {
  try {
    const { id_usuario } = req.user as TokenTypes.TokenPayload;

    if (!id_usuario || typeof id_usuario !== "string") {
      return res.status(400).json({
        success: false,
        message: "Id de usuario o juego invalido."
      });
    }

    const { result, statusCode, messageState, data } = await UsuarioService.getPersonalInfo(id_usuario);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    if (!data) {
      return res.status(400).json({
        success: false,
        message: "El usuario no tiene datos personales registrados."
      });
    }
    return res.status(200).json({
      result: true,
      message: "Los datos personales del usuario se han obtenido correctamente.",
      data: data
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error interno en el servidor: ${(err as Error).message}`
    });
  }
}

export async function updatePersonalInfo(req: Request, res: Response) {
  try {
    const { id_usuario } = req.user as TokenTypes.TokenPayload;
    const personalInfo = req.body;

    if (!id_usuario || typeof id_usuario !== "string") {
      return res.status(400).json({
        success: false,
        message: "Id de usuario o juego invalido."
      });
    }
    if (!personalInfo || Object.keys(personalInfo).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Datos personales del usuario faltantes o invalidos."
      });
    }

    const {
      nombres = null,
      apellidos = null,
      telefono = null,
      correo_contacto = null
    } = personalInfo as UsuarioTypes.SigninPayload;
    if ((nombres && typeof nombres !== "string") || (apellidos && typeof apellidos !== "string")) {
      return res.status(400).json({
        success: false,
        message: "Nombres o apellidos del usuario invalidos."
      });
    }
    if (telefono && (typeof telefono !== "string" || !RegexConstants.phoneRegex.test(telefono))) {
      return res.status(400).json({
        success: false,
        message: "Numero de telefono de contacto invalido."
      });
    }
    if (correo_contacto && (typeof correo_contacto !== "string" ||
      !RegexConstants.emailRegex.test(correo_contacto))) {
      return res.status(400).json({
        success: false,
        message: "Correo de contacto invalido."
      });
    }

    const { result, statusCode, messageState } = await UsuarioService.updatePersonalInfo(id_usuario, personalInfo);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    return res.status(200).json({
      success: true,
      message: "La informacion del usuario se ha actualizado correctamente."
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error interno en el servidor: ${(err as Error).message}`
    });
  }
}

export async function registerFavoriteGame(req: Request, res: Response) {
  try {
    const { id_usuario } = req.user as TokenTypes.TokenPayload;
    const { id_juego } = req.query;

    if ((!id_usuario || typeof id_usuario !== "string") ||
      (!id_juego || typeof id_juego !== "string")) {
      return res.status(400).json({
        success: false,
        message: "Id de usuario o juego invalido."
      });
    }

    const { result, statusCode, messageState } = await UsuarioService.registerFavoriteGame(id_usuario, id_juego);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    return res.status(201).json({
      success: true,
      message: "El juego se ha agregado a favoritos correctamente."
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error interno en el servidor: ${(err as Error).message}`
    });
  }
}

export async function getFavoriteGames(req: Request, res: Response) {
  try {
    const { id_usuario } = req.user as TokenTypes.TokenPayload;

    if (!id_usuario || typeof id_usuario !== "string") {
      return res.status(400).json({
        success: false,
        message: "Id de usuario o juego invalido."
      });
    }

    const { result, statusCode, messageState, data } = await UsuarioService.getFavoriteGames(id_usuario);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    if (!data || data.length === 0) {
      return res.status(200).json({
        success: true,
        message: "El usuario no tiene juegos favoritos registrados."
      });
    }
    return res.status(200).json({
      success: true,
      message: "Los juegos favoritos del usuario se han obtenido correctamente."
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error interno en el servidor: ${(err as Error).message}`
    });
  }
}

export async function deleteFavoriteGame(req: Request, res: Response) {
  try {
    const { id_usuario } = req.user as TokenTypes.TokenPayload;
    const { id_juego } = req.query;

    if ((!id_usuario || typeof id_usuario !== "string") ||
      (!id_juego || typeof id_juego !== "string")) {
      return res.status(400).json({
        success: false,
        message: "Id de usuario o juego invalido."
      });
    }

    const { result, statusCode, messageState } = await UsuarioService.deleteFavoriteGame(id_usuario, id_juego);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    return res.status(200).json({
      success: true,
      message: "El juego se ha quitado de favoritos correctamente."
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error interno en el servidor: ${(err as Error).message}`
    });
  }
}