import { Request, Response } from "express";
import * as SigninService from "../services/signin.service";

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, contrasenna } = req.body;

    // Validar que los datos estén presentes
    if (!nombre || !contrasenna) {
      res.status(400).json({
        error: 'El nombre y la contraseña son requeridos'
      });
      return;
    }

    // Validar que la contraseña tenga al menos 6 caracteres
    if (contrasenna.length < 6) {
      res.status(400).json({
        error: 'La contraseña debe tener al menos 6 caracteres'
      });
      return;
    }

    // Llamar al servicio de registro
    const resultado = await SigninService.registrarUsuario({
      nombre,
      contrasenna
    });

    res.status(201).json(resultado);
  } catch (error: any) {
    console.error('Error en signin:', error);
    
    // Diferenciar entre tipos de error
    if (error.message.includes('ya existe')) {
      res.status(409).json({
        error: error.message
      });
    } else {
      res.status(400).json({
        error: error.message || 'Error en el registro'
      });
    }
  }
};
