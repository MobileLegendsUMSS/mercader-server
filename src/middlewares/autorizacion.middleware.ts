import { Request, Response, NextFunction } from "express";
import { env } from "../config/env.config";
import { verifyAccessToken } from "../utils/jwt.helper";
import * as TokenTypes from "../types/token.types";

const secret = env.JWT_SECRET;

export function verifyAllowedRoles(allowedRoles: string[]) {
  return function(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1] || req.query.token;
    
    if (!token || typeof token !== "string") {
      return res.status(400).json({
        success: false,
        message: "Error, token no proporcionado."
      });
    }
    
    try {
      const user = verifyAccessToken(token) as TokenTypes.TokenPayload;
      
      req.user = user;
      const userRole = req.user.rol?.toString();
      
      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: `Acceso denegado al servicio, el usuario no tiene privilegios de ${allowedRoles.join(", ")}.`
        });
      }
      
      next();
    } catch (err: any) {
      console.error('Error al verificar token:', err);
      
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: "Token expirado. Por favor, refresque su sesión.",
          code: "TOKEN_EXPIRED"
        });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: "Token inválido. Por favor, inicie sesión nuevamente.",
          code: "TOKEN_INVALID"
        });
      } else {
        return res.status(401).json({
          success: false,
          message: err.message || "Acceso denegado al servicio, autenticación fallida.",
          code: "AUTH_ERROR"
        });
      }
    }
  };
}