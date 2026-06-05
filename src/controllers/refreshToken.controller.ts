import { Request, Response } from "express";
import * as RefreshTokenService from "../services/refreshToken.service";

export async function refreshToken(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token requerido"
      });
    }
    
    const newTokens = await RefreshTokenService.refreshAccessToken(refreshToken);
    
    res.status(200).json({
      success: true,
      ...newTokens
    });
  } catch (error: any) {
    console.error('Error en refresh token:', error);
    res.status(401).json({
      success: false,
      message: error.message || "Error al refrescar token"
    });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      await RefreshTokenService.logout(refreshToken);
    }
    
    res.status(200).json({
      success: true,
      message: "Sesión cerrada exitosamente"
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error al cerrar sesión"
    });
  }
}