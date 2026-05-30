import { Types } from "mongoose";

export enum TipoRol {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  USUARIO = "usuario"
}

export interface IRol {
  nombre_rol: string;
}