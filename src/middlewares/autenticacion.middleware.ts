import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as TokenTypes from "../types/token.types";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('La variable de entorno JWT_SECRET no está definida. Agrega JWT_SECRET en tu .env.');
}

export interface AuthRequest extends Request {
  user?: TokenTypes.TokenPayload;
}

export const autenticarToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
      res.status(401).json({
        error: 'Token no proporcionado'
      });
      return;
    }

    // Verificar y decodificar el token
    const decodificado = jwt.verify(token, JWT_SECRET) as any;
    
    // Guardar los datos del usuario en la request
    req.user = {
      id_usuario: decodificado.id,
      nombre: decodificado.nombre
    } as TokenTypes.TokenPayload;

    next();
  } catch (error: any) {
    console.error('Error al verificar token:', error);
    
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        error: 'Token expirado'
      });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        error: 'Token inválido'
      });
    } else {
      res.status(401).json({
        error: 'Error en la autenticación'
      });
    }
  }
};
