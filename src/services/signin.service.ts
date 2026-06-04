import { Types } from "mongoose";
import { Usuario } from '../models/usuario.model';
import { Rol } from '../models/rol.model';
import { UsuarioRol } from '../models/usuarioRol.model';
import * as UserTypes from '../types/usuario.types';

import { generateToken } from '../utils/jwt.helper';

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

  const foundRol = await Rol.findOne({ nombre_rol: "usuario" });

  if (!foundRol) {
    return {
      result: false,
      statusCode: 404,
      mensajeState: "El Rol no se encontrado o no existe.",
      rol: "-1"
    };
  }
  const idRol = foundRol._id;
  const rol = foundRol.nombre_rol;

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

  let registeredUserRol = {
    id_usuario: nuevoUsuario._id,
    id_rol: idRol
  }

  const rolUsuario = await UsuarioRol.create(registeredUserRol);

  if (!rolUsuario) {
    return {
      result: false,
      statusCode: 400,
      messageState: "No se pudo asignar el rol al usuario correctamente."
    };
  }

  const token = generateToken({
    id_usuario: formatedUserId,
    nombre: nuevoUsuario.nombre,
    rol: rol 
  });

  return {
    result: true,
    statusCode: 201,
    mensajeState: "Registrado exitoso, y asignado a rol Usuario",
    data: nuevoUsuario,
    token: token,
    rol: rol
  };
}