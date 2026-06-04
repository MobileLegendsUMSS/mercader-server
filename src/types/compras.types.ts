import { Types } from "mongoose";

export enum PurchaseState {
  PENDIENTE = "pendiente",
  ACEPTADO = "aceptado",
  RECHAZADO = "rechazado"
}

export interface ICompra {
  id_usuario: Types.ObjectId;
  id_carrito: Types.ObjectId;
  id_metodo_pago: Types.ObjectId;
  total: number;
  estado: PurchaseState;
  comprobante: string;
  createdAt?: Date
}