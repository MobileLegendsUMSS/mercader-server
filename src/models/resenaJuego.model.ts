import { Types } from "mongoose";
import mongoose from "mongoose";
import * as ResenaTypes from "../types/resena.types";

const resenaJuegoSchema = new mongoose.Schema<ResenaTypes.IResenaJuego>(
  {
    id_resena: {
      type: Types.ObjectId,
      ref: "Resena",
      required: [true, "ID de reseña requerido."]
    },
    id_juego: {
      type: Types.ObjectId,
      ref: "Juego",
      required: [true, "ID de juego requerido."]
    }
  },
  {
    timestamps: false,
    versionKey: false,
    collection: "resena_juego"
  }
);

// Índice compuesto para evitar reseñas duplicadas del mismo usuario para el mismo juego
resenaJuegoSchema.index({ id_resena: 1, id_juego: 1 });

export const ResenaJuego = mongoose.model<ResenaTypes.IResenaJuego>("ResenaJuego", resenaJuegoSchema);