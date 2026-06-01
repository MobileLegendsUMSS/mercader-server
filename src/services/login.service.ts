import { Types } from 'mongoose';
import { generateToken } from '../utils/jwt.helper';
import { Usuario, IUsuario } from '../models/usuario.model';
import * as UserTypes from '../types/usuario.types';
import bcrypt from 'bcryptjs';
import { UsuarioRol } from '../models/usuarioRol.model';
import { Rol } from '../models/rol.model';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('La variable de entorno JWT_SECRET no está definida. Agrega JWT_SECRET en tu .env.');
}

export async function autenticarUsuario(datos: UserTypes.LoginPayload) {
  // Validar que los datos no estén vacíos
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

  const formatedUserId = usuario._id.toString();
  console.log(formatedUserId);

  const token = generateToken({
    id_usuario: formatedUserId,
    nombre: usuario.nombre
  });

  const idRol = await UsuarioRol.findOne({ id_usuario: usuario._id });
  if (!idRol) {
    return {
      result: false,
      statusCode: 400,
      messageState: "No se encontro el rol del Usuario."
    };
  }
  const getRol = await Rol.findOne({ _id: idRol.id_rol });
  if (!getRol) {
    return {
      result: false,
      statusCode: 404,
      messageState: "Rol no encontrado"
    };
  }
  // por alguna razon lo marca en rojo el getRol, pero esta bien es del ts el error, no es un error real
  let rolName = getRol.nombre_rol;
  return {
    mensaje: 'Autenticación exitosa',
    token,
    usuario: {
      id: usuario._id.toString(),
      nombre: usuario.nombre
    },
    rol: rolName
  };
};

export class UsuarioService {
  async getUsuario(){
    return await Usuario.find()
      .populate('id_dificultad')
      .populate('id_editorial')
      .exec();
  }

  async getUsuarioById(id: string){
    if (!Types.ObjectId.isValid(id)) return null;
    return await Usuario.findById(id)
      .populate('id_dificultad')
      .populate('id_editorial')
      .exec();
  }
}
