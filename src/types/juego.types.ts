import { Types } from "mongoose";

export interface IJuego extends Document {
  titulo: string;
  descripcion: string;
  tutorial: string;
  cant_min_pers: number;
  cant_max_pers: number;
  duracion_max: number;
  duracion_min: number;
  precio: number;
  imagen: string;
  disponible: boolean;
  activo: boolean;
  justificacionRetiro?: string 
  cantidad: number;
  cantidad_prestamo: number;
  id_dificultad: Types.ObjectId;
  id_editorial: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  visitas: number;
  ventas: number;
  prestamos: number;
  portada: string;
}

export interface GameNumericItems {
  cant_min_pers: number;
  cant_max_pers: number;
  duracion_max: number;
  duracion_min: number;
  precio: number;
  cantidad: number;
}

export const numericFields: (keyof GameNumericItems)[] = [
  'cant_min_pers', 'cant_max_pers',
  'duracion_max', 'duracion_min',
  'precio', 'cantidad'
];

export interface GameStringItems {
  titulo: string;
  descripcion: string;
  tutorial: string;
  categoria: string;
  dificultad: string;
  editorial: string;
}

export const stringFields: (keyof GameStringItems)[] = [
  'titulo', 'descripcion', 'tutorial',
  'categoria', 'dificultad', 'editorial'
];