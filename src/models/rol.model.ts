import mongoose, { Document } from "mongoose";
import * as RolTypes from "../types/rol.types";

const rolSchema = new mongoose.Schema<RolTypes.IRol>(
  {
    nombre_rol: {
      type: String,
      unique: true,
      required: [true, "Nombre del rol requerido."]
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "rol"
  }
);

export const Rol = mongoose.model<RolTypes.IRol>("Rol", rolSchema); 