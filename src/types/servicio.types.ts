import { Types } from "mongoose";

export enum TipoServicio {
  COMPRA = "compra",
  ALQUILER = "alquiler",
  PRESTAMO = "prestamo"
}

export interface IServicio {
  _id?: Types.ObjectId;
  nombre: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IServicioJuego {
  _id?: Types.ObjectId;
  id_juego: Types.ObjectId;
  id_servicio: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}