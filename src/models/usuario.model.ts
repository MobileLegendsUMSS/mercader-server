import mongoose from "mongoose";
import * as UserTypes from "../types/usuario.types";

const userSchema = new mongoose.Schema<UserTypes.IUsuario>(
  {
    nombre: {
      type: String,
      unique: true,
      required: [true, "Nombre del usuario requerido."]
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "usuario"
  }
);

export const Usuario = mongoose.model<UserTypes.IUsuario>("Usuario", userSchema);