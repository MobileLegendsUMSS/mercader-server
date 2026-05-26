import { Usuario } from '../models/usuario.model';
import { generateToken } from '../utils/jwt.helper';
import * as UserTypes from '../types/usuario.types';
import bcrypt from 'bcryptjs';

export async function registrarUsuario(personalInfo: UserTypes.SigninPayload) {
  const {
    nombre,
    contrasenna,
    nombres = null,
    apellidos = null,
    telefono,
    correo_contacto,
  } = personalInfo

  // Verificar si el usuario ya existe
  const usuarioExistente = await Usuario.findOne({ nombre: nombre });
  if (usuarioExistente) {
    return {
      result: false,
      statusCode: 400,
      messageState: "El usuario ya existe."
    };
  }

  // Encriptar la contraseña con bcryptjs (10 rondas de salt)
  const contrasennaEncriptada = await bcrypt.hash(contrasenna, 10);

  // Crear el nuevo usuario
  let registerCondition = {
    nombre: nombre,
    contrasenna: contrasennaEncriptada,
    telefono: telefono,
    correo_contacto: correo_contacto
  };
  if (nombres) {
    Object.assign(registerCondition, { nombres: nombres });
  }
  if (apellidos) {
    Object.assign(registerCondition, { apellidos: apellidos });
  }
  const nuevoUsuario = await Usuario.create(registerCondition);
  if (!nuevoUsuario) {
    return {
      result: false,
      statusCode: 400,
      messageState: "No se pudo crear el usuario correctamente."
    };
  }

  const formatedUserId = nuevoUsuario._id.toString();
  console.log(formatedUserId);

  const token = generateToken({
    id_usuario: formatedUserId,
    nombre: nuevoUsuario.nombre
  });

  return {
    result: true,
    statusCode: 201,
    mensajeState: "Usuario registrado exitosamente",
    data: nuevoUsuario,
    token: token
  };
}