import { Types } from "mongoose";

export interface ICompra {
  id_usuario: Types.ObjectId;
  id_carrito: Types.ObjectId;
  id_metodo_pago: Types.ObjectId;
  total: number;
  comprobante: Buffer;
}