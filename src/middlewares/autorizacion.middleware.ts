import { Request, Response, NextFunction } from "express";
import { env } from "../config/env.config";
import jwt from "jsonwebtoken";
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
    jwt.verify(token, secret as string, (err, user) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Acceso denegado al servicio, autenticacion fallida por token expirado o incorrecto."
        });
      }
      req.user = user as TokenTypes.TokenPayload;
      const userRole = req.user.rol?.toString();
      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: `Acceso denegado al servicio, el usuario no tiene privilegios de ${allowedRoles.join(", ")}.`
        });
      }
      next();
    });
  };
}