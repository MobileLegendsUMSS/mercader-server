import { Types } from "mongoose";
import mongoose from "mongoose";
import * as CartTypes from "../types/carrito.types";

const carritoJuegoSchema = new mongoose.Schema<CartTypes.ICarritoJuego>(
  {
    id_carrito: {
      type: Types.ObjectId,
      ref: "Carrito",
      required: [true, "ID de carrito requerido."]
    },
    id_juego: {
      type: Types.ObjectId,
      ref: "Juego",
      required: [true, "ID de juego requerido."]
    },
    cantidad_solicitada: {
      type: Number,
      required: true,
      min: [1, "La cantidad no puede ser negativa ni igual a 0."],
      default: 1
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "carrito_juego"
  }
);

export const CarritoJuego = mongoose.model<CartTypes.ICarritoJuego>("CarritoJuego", carritoJuegoSchema);