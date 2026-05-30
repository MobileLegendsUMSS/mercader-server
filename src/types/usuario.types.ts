import { Types } from "mongoose";

export interface IUsuario {
  _id?: string;
  nombre: string;
  contrasenna: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo_contacto: string;
  mercapoints: number;
  foto_perfil?: Buffer;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginPayload {
  nombre: string;
  contrasenna: string;
}

export interface LoginResponse {
  mensaje: string;
  token: string;
  usuario: {
    id: string;
    nombre: string;
  };
  rol: string;
}

export interface SigninPayload {
  nombre: string;
  contrasenna: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo_contacto: string;
}

export interface SigninResponse {
  mensaje: string;
  token: string;
  usuario: {
    id: string;
    nombre: string;
    rol: string;
  };
}

export interface IUsuarioJuego {
  id_usuario: Types.ObjectId;
  id_juego: Types.ObjectId;
}

export interface IUsuarioRol {
  id_usuario: Types.ObjectId;
  id_rol: Types.ObjectId;
}