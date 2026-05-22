import { Usuario } from '../models/usuario.model';
import * as UserTypes from '../types/usuario.types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registrarUsuario = async (
  datos: UserTypes.SigninPayload
): Promise<UserTypes.SigninResponse> => {
  // Validar que los datos no estén vacíos
  if (!datos.nombre || !datos.contrasenna) {
    throw new Error('El nombre y la contraseña son requeridos');
  }

  // Verificar si el usuario ya existe
  const usuarioExistente = await Usuario.findOne({ nombre: datos.nombre });
  if (usuarioExistente) {
    throw new Error('El usuario ya existe');
  }

  // Encriptar la contraseña con bcryptjs (10 rondas de salt)
  const contrasennaEncriptada = await bcrypt.hash(datos.contrasenna, 10);

  // Crear el nuevo usuario
  const nuevoUsuario = new Usuario({
    nombre: datos.nombre,
    contrasenna: contrasennaEncriptada
  });

  // Guardar en la base de datos
  const usuarioGuardado = await nuevoUsuario.save();

  // TODO: GENERAR TOKEN JWT AQUÍ
  // Similar a lo que se hace en login.service.ts
  // El frontend necesita este token para guardar en cache y usarlo en futuras peticiones
  // 
  const JWT_SECRET = process.env.JWT_SECRET;
  const token = jwt.sign(
    {
      id: usuarioGuardado._id.toString(),
      nombre: usuarioGuardado.nombre
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    mensaje: 'Usuario registrado exitosamente',
    token,
    usuario: {
      id: usuarioGuardado._id.toString(),
      nombre: usuarioGuardado.nombre
    }
  };
};
