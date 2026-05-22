import mongoose, { Schema, Types } from "mongoose";
import * as UsuarioTypes from "../types/usuario.types"

const userGameSchema = new Schema<UsuarioTypes.IUsuarioJuego>(
  {
    id_usuario: {
      type: Types.ObjectId,
      ref: "Usuario",
      required: [true, "ID de usuario requerido."]
    },
    id_juego: {
      type: Types.ObjectId,
      ref: "Juego",
      required: [true, "ID de juego requerido."]
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "usuario_juego"
  }
);

export const UsuarioJuego = mongoose.model<UsuarioTypes.IUsuarioJuego>("UsuarioJuego", userGameSchema);