import { Types } from 'mongoose';
import { generateToken } from '../utils/jwt.helper';
import { Usuario, IUsuario } from '../models/usuario.model';
import * as UserTypes from '../types/usuario.types';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('La variable de entorno JWT_SECRET no está definida. Agrega JWT_SECRET en tu .env.');
}

export const autenticarUsuario = async (
  datos: UserTypes.LoginPayload
): Promise<UserTypes.LoginResponse> => {
  // Validar que los datos no estén vacíos
  if (!datos.nombre || !datos.contrasenna) {
    throw new Error('El nombre y la contraseña son requeridos');
  }

  // Buscar el usuario por nombre
  const usuario = await Usuario.findOne({ nombre: datos.nombre });
  if (!usuario) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  // Comparar la contraseña proporcionada con la encriptada en la BD
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
  })

  // Generar token JWT con expiración de 24 horas
  /*
  const token = jwt.sign(
    {
      id: usuario._id.toString(),
      nombre: usuario.nombre
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  */

  return {
    mensaje: 'Autenticación exitosa',
    token,
    usuario: {
      id: usuario._id.toString(),
      nombre: usuario.nombre
    }
  };
};

export class UsuarioService {
  async getUsuario(): Promise<IUsuario[]> {
    return await Usuario.find()
      .populate('id_dificultad')
      .populate('id_editorial')
      .exec();
  }

  async getUsuarioById(id: string): Promise<IUsuario | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return await Usuario.findById(id)
      .populate('id_dificultad')
      .populate('id_editorial')
      .exec();
  }
}
