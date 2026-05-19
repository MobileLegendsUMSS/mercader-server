import { Types } from "mongoose";
import mongoose from "mongoose";
import * as PrestamoTypes from "../types/prestamos.types";
import * as ServicioTypes from "../types/servicio.types";

const loanGameSchema = new mongoose.Schema<PrestamoTypes.IPrestamoJuego>(
  {
    id_prestamo: {
      type: Types.ObjectId,
      ref: "Prestamo",
      required: [true, "ID del prestamo requerido."]
    },
    id_juego: {
      type: Types.ObjectId,
      ref: "Juego",
      required: [true, "ID de juego requerido."]
    },
    servicio: {
      type: String,
      required: true,
      default: ServicioTypes.TipoServicio.PRESTAMO
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "prestamo_juego"
  }
);

export const PrestamoJuego = mongoose.model<PrestamoTypes.IPrestamoJuego>("PrestamoJuego", loanGameSchema);