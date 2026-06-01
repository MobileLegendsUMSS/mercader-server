import { Types } from "mongoose";
import mongoose from "mongoose";
import * as ResenaTypes from "../types/resena.types";

const resenaSchema = new mongoose.Schema<ResenaTypes.IResena>(
  {
    id_usuario: {
      type: Types.ObjectId,
      ref: "Usuario",
      required: [true, "ID de usuario requerido."]
    },
    rating: {
      type: Number,
      required: [true, "Calificación requerida."],
      min: [1, "La calificación debe ser entre 1 y 5 estrellas."],
      max: [5, "La calificación debe ser entre 1 y 5 estrellas."]
    },
    content: {
      type: String,
      required: [true, "Contenido de la reseña requerido."],
      minlength: [10, "La reseña debe tener al menos 10 caracteres."],
      maxlength: [500, "La reseña no puede exceder los 500 caracteres."]
    },
    timestamp: {
      type: Number,
      required: true,
      default: Date.now
    }
  },
  {
    timestamps: false,
    versionKey: false,
    collection: "resenas"
  }
);

export const Resena = mongoose.model<ResenaTypes.IResena>("Resena", resenaSchema);