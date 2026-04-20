import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IEditorial extends Document {
  nombre: string;
  pais: string;
}

const EditorialSchema = new Schema<IEditorial>(
  {
    pais: {
      type: String,
      trim: true,
      maxlength: [30, 'El pais no puede exceder 30 caracteres']
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'editorial'
  }
);

export const Editorial = mongoose.model<IEditorial>('Editorial', EditorialSchema);