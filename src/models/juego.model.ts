import mongoose, { Schema, Document, Types } from 'mongoose';
import * as JuegoTypes from "../types/juego.types"

const JuegoSchema = new Schema<JuegoTypes.IJuego>(
  {
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      unique: true,
      maxlength: [100, 'El título no puede exceder 100 caracteres']
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      maxlength: [200, 'La descripción no puede exceder 200 caracteres']
    },
    tutorial: {
      type: String,
      required: false,
    },
    cant_min_pers: {
      type: Number,
      required: true,
      min: [1, 'Minimo 1 persona'],
      max: [10, 'Maximo 10 personas']
    },
    cant_max_pers: {
      type: Number,
      required: true,
      validate: {
        validator: function(this: any, value: number) {
          return value >= this.cant_min_pers;
        },
        message: 'La cantidad maxima debe ser mayor o igual a la mínima'
      }
    },
    duracion_min: {
      type: Number,
      required: true,
      min: [5, 'Duración mínima 5 minutos']
    },
    duracion_max: {
      type: Number,
      required: true,
      validate: {
        validator: function(this: any, value: number) {
          return value >= this.duracion_min;
        },
        message: 'La duración máxima debe ser mayor o igual a la mínima'
      }
    },
    precio: {
      type: Number,
      required: true,
      min: [0, 'El precio no puede ser negativo'],
      default: 0
    },
    imagen: {
      type: String,
      match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'URL de imagen inválida']
    },
    disponible: {
      type: Boolean,
      default: true
    },
    activo: {
      type: Boolean,
      default: true
    },
    justificacionRetiro: {
      type: String,
      required: false
    },
    cantidad: {
      type: Number,
      required: true,
      min: [0, 'La cantidad no puede ser negativa'],
      default: 0
    },
    cantidad_prestamo: {
      type: Number,
      required: true,
      min: [0, "La cantidad de prestamos no puede ser negativa"],
      default: 0
    },
    id_dificultad: {
      type: Schema.Types.ObjectId,
      ref: 'Dificultad',
      required: [true, 'La dificultad es obligatoria']
    },
    id_editorial: {
      type: Schema.Types.ObjectId,
      ref: 'Editorial',
      required: [true, 'La editorial es obligatoria']
    },
    visitas: {
      type: Number,
      required: true,
      default: 0
    },
    ventas: {
      type: Number,
      required: true,
      default: 0
    },
    prestamos: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'juego'
  }
);

//obtener el rango de jugadores como texto
JuegoSchema.virtual('rangoJugadores').get(function(this: JuegoTypes.IJuego) {
  return `${this.cant_min_pers} - ${this.cant_max_pers} jugadores`;
});

//obtener el rango de duración como texto
JuegoSchema.virtual('rangoDuracion').get(function(this: JuegoTypes.IJuego) {
  return `${this.duracion_min} - ${this.duracion_max} minutos`;
});

JuegoSchema.methods.verificarDisponibilidad = function(cantidadSolicitada: number): boolean {
  return this.disponible && this.cantidad >= cantidadSolicitada;
};

JuegoSchema.statics.buscarDisponibles = function() {
  return this.find({ disponible: true, cantidad: { $gt: 0 } });
};

export const Juego = mongoose.model<JuegoTypes.IJuego>('Juego', JuegoSchema);