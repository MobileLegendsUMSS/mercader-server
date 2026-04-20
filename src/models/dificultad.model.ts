import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDificultad extends Document {
  descripcion: string;
}

const DificultadSchema = new Schema<IDificultad>(
  {
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      maxlength: [50, 'La descripción no puede exceder 50 caracteres']
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'dificultad'
  }
);

export const Dificultad = mongoose.model<IDificultad>('Dificultad', DificultadSchema);