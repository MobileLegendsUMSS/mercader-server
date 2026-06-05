import { Types } from 'mongoose';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.helper';
import { Usuario } from '../models/usuario.model';
import * as UserTypes from '../types/usuario.types';
import bcrypt from 'bcryptjs';
import { UsuarioRol } from '../models/usuarioRol.model';
import { Rol } from '../models/rol.model';
import { RefreshToken } from '../models/refreshToken.model';

export async function autenticarUsuario(datos: UserTypes.LoginPayload) {
  if (!datos.nombre || !datos.contrasenna) {
    throw new Error('El nombre y la contraseña son requeridos');
  }

  const usuario = await Usuario.findOne({ nombre: datos.nombre });
  if (!usuario) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  const contrasennaValida = await bcrypt.compare(
    datos.contrasenna,
    usuario.contrasenna
  );

  if (!contrasennaValida) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  const formatedUserId = usuario._id.toString();

  // Obtener el rol del usuario
  const usuarioRol = await UsuarioRol.findOne({ id_usuario: usuario._id });
  if (!usuarioRol) {
    throw new Error('No se encontró el rol del usuario');
  }

  const rolDoc = await Rol.findOne({ _id: usuarioRol.id_rol });
  if (!rolDoc) {
    throw new Error('No se encontró el rol del usuario');
  }

  const rolNombre = rolDoc.nombre_rol;

  const accessToken = generateAccessToken({
    id_usuario: formatedUserId,
    nombre: usuario.nombre,
    rol: rolNombre
  });

  const refreshToken = generateRefreshToken({
    id_usuario: formatedUserId
  });

  await RefreshToken.create({
    token: refreshToken,
    id_usuario: usuario._id,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    revoked: false
  });

  return {
    mensaje: 'Autenticación exitosa',
    accessToken,
    refreshToken,
    usuario: {
      id: usuario._id.toString(),
      nombre: usuario.nombre,
    },
    rol: rolNombre
  };
}