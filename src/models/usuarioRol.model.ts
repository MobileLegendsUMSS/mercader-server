import mongoose, { Schema, Types } from "mongoose";
import * as UsuarioTypes from "../types/usuario.types"

const userRolSchema = new Schema<UsuarioTypes.IUsuarioRol>(
  {
    id_usuario: {
      type: Types.ObjectId,
      ref: "Usuario",
      required: [true, "ID de usuario requerido."]
    },
    id_rol: {
      type: Types.ObjectId,
      ref: "Rol",
      required: [true, "ID de rol requerido."]
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "usuario_rol"
  }
);

export const UsuarioRol = mongoose.model<UsuarioTypes.IUsuarioRol>("UsuarioRol", userRolSchema);