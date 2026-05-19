import { Types } from "mongoose";
import mongoose from "mongoose";
import * as CartTypes from "../types/carrito.types";

const cartSchema = new mongoose.Schema<CartTypes.ICarrito>(
  {
    id_usuario: {
      type: Types.ObjectId,
      ref: "Usuario",
      required: [true, "ID de usuario requerido."]
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "carrito"
  }
);

export const Carrito = mongoose.model<CartTypes.ICarrito>("Carrito", cartSchema);