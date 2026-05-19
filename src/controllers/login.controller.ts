import { Request, Response } from "express";
import * as LoginService from "../services/login.service";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, contrasenna } = req.body;

    // Validar que los datos estén presentes
    if (!nombre || !contrasenna) {
      res.status(400).json({
        error: 'El nombre y la contraseña son requeridos'
      });
      return;
    }

    // Llamar al servicio de autenticación
    const resultado = await LoginService.autenticarUsuario({
      nombre,
      contrasenna
    });

    res.status(200).json(resultado);
  } catch (error: any) {
    console.error('Error en login:', error);
    res.status(401).json({
      error: error.message || 'Error en la autenticación'
    });
  }
};
