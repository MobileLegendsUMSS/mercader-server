import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.helper';
import * as TokenTypes from "../types/token.types";

export interface AuthRequest extends Request {
  user?: TokenTypes.TokenPayload;
}

export const autenticarToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        error: 'Token no proporcionado',
        code: 'TOKEN_MISSING'
      });
      return;
    }

    const decodificado = verifyAccessToken(token);
    
    req.user = {
      id_usuario: decodificado.id_usuario,
      nombre: decodificado.nombre,
      rol: decodificado.rol
    } as TokenTypes.TokenPayload;

    next();
  } catch (error: any) {
    console.error('Error al verificar token:', error);

    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        error: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        error: 'Token inválido',
        code: 'TOKEN_INVALID'
      });
    } else {
      res.status(401).json({
        error: 'Error en la autenticación',
        code: 'AUTH_ERROR'
      });
    }
  }
};