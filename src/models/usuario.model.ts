import mongoose, { Document } from "mongoose";
import * as UserTypes from "../types/usuario.types";
import { truncateSync } from "node:fs";

// si esta el interface creo que de nada serviria el usuario.types
export interface IUsuario extends Document {
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
// ojo aqui
const userSchema = new mongoose.Schema<UserTypes.IUsuario>(
  {
    nombre: {
      type: String,
      unique: true,
      required: [true, "Nombre del usuario requerido."]
    },
    contrasenna: {
      type: String,
      required: [true, "Contraseña del usuario requerida."]
    },
    nombres: {
      type: String,
      unique: true,
      required: false
    },
    apellidos: {
      type: String,
      unique: true,
      required: false
    },
    telefono: {
      type: String,
      unique: false,
      required: [true, "Telefono de contacto requerido."],
    },
    correo_contacto: {
      type: String,
      unique: false,
      required: [true, "Correo de contacto requerido."]
    },
    mercapoints: {
      type: Number,
      unique: false,
      required: true,
      default: 0
    },
    foto_perfil: {
      data: Buffer,
      contentType: String
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "usuario"
  }
);

export const Usuario = mongoose.model<UserTypes.IUsuario>("Usuario", userSchema); 