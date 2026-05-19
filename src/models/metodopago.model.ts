import mongoose, { Schema, Types } from "mongoose"
import * as MetodoPagoTypes from "../types/pago.types";

const payMethodSchema = new Schema<MetodoPagoTypes.IMetodoPago>(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del método de pago es requerido."],
      trim: true,
      unique: true,
      maxlength: [100, "El nombre del método de pago no puede exceder los 100 caracteres."]
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "metodo_pago"
  }
);

export const MetodoPago = mongoose.model<MetodoPagoTypes.IMetodoPago>("MetodoPago", payMethodSchema);