import mongoose from "mongoose";
import * as ServiceTypes from "../types/servicio.types";

const serviceSchema = new mongoose.Schema<ServiceTypes.IServicio>(
  {
    nombre: {
      type: String,
      unique: true,
      required: [true, "Nombre del servicio requerido."]
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "servicio" 
  }
);

export const Servicio = mongoose.model<ServiceTypes.IServicio>("Servicio", serviceSchema);