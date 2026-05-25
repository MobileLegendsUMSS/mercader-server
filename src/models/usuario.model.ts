import mongoose, { Document } from "mongoose";
import * as UserTypes from "../types/usuario.types";

export interface IUsuario extends Document {
  nombre: string;
  contrasenna: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUsuario>(
  {
    nombre: {
      type: String,
      unique: true,
      required: [true, "Nombre del usuario requerido."]
    },
    contrasenna: {
      type: String,
      required: [true, "Contraseña del usuario requerida."]
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "usuario"
  }
);

export const Usuario = mongoose.model<IUsuario>("Usuario", userSchema);
