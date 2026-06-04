import mongoose, { Schema } from 'mongoose';
import * as CategoriaTypes from "../types/categoria.types";

const CategoriaSchema = new Schema<CategoriaTypes.ICategoria>(
  {
    descripcion: {
      type: String,
      required: [true, 'La descripcion es obligatoria'],
      unique: true,
      trim: true,
      maxlength: [50, 'La descripción no puede exceder 50 caracteres']
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'categoria'
  }
);

export const Categoria = mongoose.model<CategoriaTypes.ICategoria>('Categoria', CategoriaSchema);