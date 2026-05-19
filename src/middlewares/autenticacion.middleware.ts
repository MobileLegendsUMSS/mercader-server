import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_muy_seguro_cambiar_en_produccion';

export interface AuthRequest extends Request {
  usuario?: {
    id: string;
    nombre: string;
  };
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
    req.usuario = {
      id: decodificado.id,
      nombre: decodificado.nombre
    };

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
