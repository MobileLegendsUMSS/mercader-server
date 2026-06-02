import mongoose, { Schema, Types } from "mongoose";
import * as CompraTypes from "../types/compras.types";

const purchaseSchema = new Schema<CompraTypes.ICompra>(
  {
    id_usuario: {
      type: Types.ObjectId,
      ref: "Usuario",
      required: [true, "ID de usuario requerido."]
    },
    id_carrito: {
      type: Types.ObjectId,
      ref: "Carrito",
      required: [true, "ID de carrito requerido."]
    },
    id_metodo_pago: {
      type: Types.ObjectId,
      ref: "MetodoPago",
      required: [true, "ID de metodo de pago requerido."]
    },
    total: {
      type: Number,
      required: true,
      min: [1, "El total no puede ser negativo ni igual a 0."],
      default: 1
    },
    comprobante: {
      type: Buffer,
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "compra"
  }
);

export const Compra = mongoose.model<CompraTypes.ICompra>("Compra", purchaseSchema);