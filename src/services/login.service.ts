import { Types } from 'mongoose';
import { generateToken } from '../utils/jwt.helper';
import { Usuario } from '../models/usuario.model';
import * as UserTypes from '../types/usuario.types';
import bcrypt from 'bcryptjs';
import { UsuarioRol } from '../models/usuarioRol.model';
import { Rol } from '../models/rol.model';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('La variable de entorno JWT_SECRET no está definida. Agrega JWT_SECRET en tu .env.');
}

export async function autenticarUsuario(datos: UserTypes.LoginPayload) {
  if (!datos.nombre || !datos.contrasenna) {
    throw new Error('El nombre y la contraseña son requeridos');
  }

  // Buscar el usuario por nombre
  const usuario = await Usuario.findOne({ nombre: datos.nombre });
  if (!usuario) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  // Comparar la contrasenna proporcionada con la encriptada en la BD
  const contrasennaValida = await bcrypt.compare(
    datos.contrasenna,
    usuario.contrasenna
  );

  if (!contrasennaValida) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  const formattedUserId = usuario._id.toString();

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

  const token = generateToken({
    id_usuario: formattedUserId,
    nombre: usuario.nombre,
    rol: rolNombre
  });

  return {
    mensaje: 'Autenticación exitosa',
    token,
    usuario: {
      id: usuario._id.toString(),
      nombre: usuario.nombre
    },
    rol: rolNombre
  };
}