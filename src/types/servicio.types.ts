import { Types } from "mongoose";

export enum TipoServicio {
  COMPRA = "compra",
  ALQUILER = "alquiler",
  PRESTAMO = "prestamo"
}

export interface IServicio {
  nombre: string;
}

export interface IServicioJuego {
  id_juego: Types.ObjectId;
  id_servicio: Types.ObjectId;
}