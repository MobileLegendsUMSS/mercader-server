import mongoose, { Schema, Document } from 'mongoose';

export interface IDificultad extends Document {
  nombre: string;
}

const DificultadSchema = new Schema<IDificultad>(
  {
    nombre: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      unique: true,
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