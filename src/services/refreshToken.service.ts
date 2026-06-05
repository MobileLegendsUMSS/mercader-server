import { Types } from 'mongoose';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.helper';
import { RefreshToken } from '../models/refreshToken.model';
import { Usuario } from '../models/usuario.model';
import { UsuarioRol } from '../models/usuarioRol.model';
import { Rol } from '../models/rol.model';

export async function refreshAccessToken(refreshToken: string) {
  try {
    // verificar refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // buscar token en BD
    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      revoked: false
    });
    
    if (!storedToken) {
      throw new Error('Refresh token inválido o revocado');
    }
    
    // verificar si expiró
    if (storedToken.expiresAt < new Date()) {
      await storedToken.deleteOne();
      throw new Error('Refresh token expirado');
    }
    
    // obtener usuario y su rol ACTUALIZADO
    const usuario = await Usuario.findById(storedToken.id_usuario);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    
    const usuarioRol = await UsuarioRol.findOne({ id_usuario: usuario._id });
    if (!usuarioRol) {
      throw new Error('Rol no encontrado');
    }
    
    const rolDoc = await Rol.findOne({ _id: usuarioRol.id_rol });
    const rolNombre = rolDoc?.nombre_rol || 'usuario';
    
    // IMPORTANTE: Verificar si el refresh token fue revocado por cambio de rol
    // Esto ya se manejó arriba con `revoked: false`
    
    // Generar nuevos tokens con el rol ACTUALIZADO
    const newAccessToken = generateAccessToken({
      id_usuario: usuario._id.toString(),
      nombre: usuario.nombre,
      rol: rolNombre  // rol actualizado
    });
    
    const newRefreshToken = generateRefreshToken({
      id_usuario: usuario._id.toString()
    });
    
    // invalidar refresh token antiguo
    storedToken.revoked = true;
    await storedToken.save();
    
    // guardar nuevo refresh token
    await RefreshToken.create({
      token: newRefreshToken,
      id_usuario: usuario._id,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      revoked: false
    });
    
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      rol: rolNombre  // devolver el rol actualizado al frontend
    };
  } catch (error) {
    throw error;
  }
}

export async function logout(refreshToken: string) {
  const storedToken = await RefreshToken.findOne({ token: refreshToken });
  if (storedToken) {
    storedToken.revoked = true;
    await storedToken.save();
  }
  return { mensaje: 'Sesión cerrada exitosamente' };
}

// revocar todos los tokens de un usuario (forzar logout)
export async function revocarTodosLosTokens(id_usuario: string, motivo: string = 'Cambio de rol') {
  await RefreshToken.updateMany(
    { id_usuario: new Types.ObjectId(id_usuario), revoked: false },
    { 
      revoked: true,
      revokedReason: motivo,
      revokedAt: new Date()
    }
  );
}