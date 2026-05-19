import { Usuario } from '../models/usuario.model';
import * as UserTypes from '../types/usuario.types';
import bcrypt from 'bcryptjs';

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

  return {
    mensaje: 'Usuario registrado exitosamente',
    usuario: {
      id: usuarioGuardado._id.toString(),
      nombre: usuarioGuardado.nombre
    }
  };
};
