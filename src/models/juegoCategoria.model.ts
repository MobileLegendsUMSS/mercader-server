import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IJuegoCategoria extends Document {
  id_juego: Types.ObjectId;
  id_categoria: Types.ObjectId;
  createdAt?: Date;
}

const JuegoCategoriaSchema = new Schema<IJuegoCategoria>(
  {
    id_juego: {
      type: Schema.Types.ObjectId,
      ref: 'Juego',
      required: [true, 'ID de juego es obligatorio']
    },
    id_categoria: {
      type: Schema.Types.ObjectId,
      ref: 'Categoria',
      required: [true, 'ID de la categoría es obligatorio']
    }
  },
  {
    collection: 'juego_categoria'
  }
);

JuegoCategoriaSchema.index({ id_juego: 1, id_categoria: 1 }, { unique: true });

export const JuegoCategoria = mongoose.model<IJuegoCategoria>('JuegoCategoria', JuegoCategoriaSchema);