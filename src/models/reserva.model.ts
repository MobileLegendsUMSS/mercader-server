import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReserva extends Document {
  id_juego: Types.ObjectId;
  fecha_reserva: Date;
  hora_reserva: string;
  estado: string;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ReservaSchema = new Schema<IReserva>(
  {
    id_juego: {
      type: Schema.Types.ObjectId,
      ref: 'Juego',
      required: [true, 'El juego es obligatorio']
    },
    fecha_reserva: {
      type: Date,
      required: [true, 'La fecha de reserva es obligatoria']
    },
    hora_reserva: {
      type: String,
      required: [true, 'La hora de reserva es obligatoria'],
      trim: true
    },
    estado: {
      type: String,
      enum: ['pendiente', 'confirmada', 'cancelada'],
      default: 'pendiente'
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'reserva'
  }
);

export const Reserva = mongoose.model<IReserva>('Reserva', ReservaSchema);
