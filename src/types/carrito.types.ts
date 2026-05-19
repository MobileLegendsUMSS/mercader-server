import { Types } from "mongoose";

export interface ICarrito {
  id_usuario: Types.ObjectId;
  activo: boolean;
}

export interface ICarritoJuego {
  id_carrito: Types.ObjectId;
  id_juego: Types.ObjectId;
  cantidad_solicitada: number;
}