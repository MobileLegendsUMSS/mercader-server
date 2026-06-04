import { Types } from "mongoose"
import * as ServicioTypes from "../types/servicio.types";

export interface IPrestamo {
  id_usuario: Types.ObjectId;
  fecha_solicitud: Date;
  fecha_limite: Date;
  fecha_inicio: Date;
  fecha_fin: Date;
  multado: Boolean;
}

export interface IPrestamoJuego {
  id_prestamo: Types.ObjectId;
  id_juego: Types.ObjectId;
  servicio: ServicioTypes.TipoServicio
}

export interface PrestamoInfo {
  servicio: ServicioTypes.TipoServicio;
  fecha_solicitud: Date;
  fecha_limite: Date;
  fecha_inicio?: Date;
  fecha_fin?: Date
}