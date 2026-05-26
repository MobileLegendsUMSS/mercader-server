import { Request, Response } from "express";
import * as RegexConstants from "../utils/regex.constants";
import * as UsuarioTypes from "../types/usuario.types";
import * as SigninService from "../services/signin.service";

export async function signin(req: Request, res: Response) {
  try {
    const personalInfo = req.body;

    if (!personalInfo || Object.keys(personalInfo).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Datos personales del usuario faltantes o invalidos."
      });
    }

    const {
      nombre,
      contrasenna,
      nombres = null,
      apellidos = null,
      telefono,
      correo_contacto,
    } = personalInfo as UsuarioTypes.SigninPayload;

    // Validar que los datos estén presentes
    if (!nombre || typeof nombre !== "string" || !contrasenna || typeof contrasenna !== "string") {
      return res.status(400).json({
        error: 'El nombre y la contraseña son requeridos'
      });
    }
    // Validar que la contraseña tenga al menos 6 caracteres
    if (contrasenna.length < 6) {
      return res.status(400).json({
        error: 'La contraseña debe tener al menos 6 caracteres'
      });
    }
    if ((nombres && typeof nombres !== "string") || (apellidos && typeof apellidos !== "string")) {
      return res.status(400).json({
        success: false,
        message: "Nombres o apellidos del usuario invalidos."
      });
    }
    if (!telefono || typeof telefono !== "string" || !RegexConstants.phoneRegex.test(telefono)) {
      return res.status(400).json({
        success: false,
        message: "Numero de telefono de contacto invalido."
      });
    }
    if (!correo_contacto || typeof correo_contacto !== "string" ||
      !RegexConstants.emailRegex.test(correo_contacto)) {
      return res.status(400).json({
        success: false,
        message: "Correo de contacto invalido."
      });
    }

    // Llamar al servicio de registro
    const { result, statusCode, messageState, data, token } = await SigninService.registrarUsuario(personalInfo);
    if (!result) {
      return res.status(statusCode).json({
        success: false,
        message: messageState
      });
    }
    return res.status(201).json({
      success: true,
      message: "El usuario se ha creado correctamente.",
      data: data,
      token: token
    });
  } catch (err) {
    console.error('Error en signin:', (err as Error).message);

    // Diferenciar entre tipos de error
    if ((err as Error).message.includes('ya existe')) {
      return res.status(409).json({
        success: false,
        message: (err as Error).message
      });
    } else {
      return res.status(400).json({
        success: false,
        message: (err as Error).message || 'Error en el registro'
      });
    }
  }
};
