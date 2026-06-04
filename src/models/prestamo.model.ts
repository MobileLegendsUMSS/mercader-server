import mongoose, { Schema, Types } from "mongoose";
import * as PrestamoTypes from "../types/prestamos.types";

const loanSchema = new Schema<PrestamoTypes.IPrestamo>(
  {
    id_usuario: {
      type: Types.ObjectId,
      ref: "Usuario",
      required: [true, "ID de usuario requerido."] 
    },
    fecha_solicitud: {
      type: Date,
      required: [true, "Fecha de solicitus requerida"],
      default: new Date()
    },
    fecha_limite: {
      type: Date,
      required: [true, "Fecha de fin requerida"],
      default: new Date((new Date()).getTime() + (3 * 60 * 60 * 1000))
    },
    fecha_inicio: {
      type: Date
    },
    fecha_fin: {
      type: Date
    },
    multado: {
      type: Boolean,
      required: [true, "Estado de multa requerido"],
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "prestamo"
  }
);

export const Prestamo = mongoose.model<PrestamoTypes.IPrestamo>("Prestamo", loanSchema);