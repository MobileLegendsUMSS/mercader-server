import { Types } from "mongoose";

export interface IResena {
  _id: Types.ObjectId;
  id_usuario: Types.ObjectId;
  rating: number; 
  content: string;
  timestamp: number;
}

export interface IResenaJuego {
  _id: Types.ObjectId;
  id_resena: Types.ObjectId;
  id_juego: Types.ObjectId;
}

export interface CreateResenaBody {
  id_juego: string;
  rating: number;      
  content: string;
}

export interface ResenaResponse {
  id_resena: string;
  rating: number;       
  content: string;
  timestamp: number;
  usuario: {
    id: string;
    nombre: string;
  };
}

export interface GetReviewsResponse {
  success: boolean;
  message: string;
  data: ResenaResponse[];
}