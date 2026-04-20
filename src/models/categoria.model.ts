import mongoose, { Schema, Document } from 'mongoose';

export interface ICategoria extends Document {
  descripcion: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CategoriaSchema = new Schema<ICategoria>(
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

export const Categoria = mongoose.model<ICategoria>('Categoria', CategoriaSchema);