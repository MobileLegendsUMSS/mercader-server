import mongoose from "mongoose";
import { Types } from "mongoose";
import * as ServiceTypes from "../types/servicio.types";

const serviceGameSchema = new mongoose.Schema<ServiceTypes.IServicioJuego>(
  {
    id_juego: {
      type: Types.ObjectId,
      ref: 'Juego',
      required: [true, "ID del juego requerido."]
    },
    id_servicio: {
      type: Types.ObjectId,
      ref: 'Servicio',
      required: [true, "ID del servicio requerido."]
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "servicio_juego"
  }
);

export const ServicioJuego = mongoose.model<ServiceTypes.IServicioJuego>("ServicioJuego", serviceGameSchema);