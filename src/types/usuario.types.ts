export interface IUsuario {
  _id?: string;
  nombre: string;
  contrasenna: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginPayload {
  nombre: string;
  contrasenna: string;
}

export interface LoginResponse {
  mensaje: string;
  token: string;
  usuario: {
    id: string;
    nombre: string;
  };
}

export interface SigninPayload {
  nombre: string;
  contrasenna: string;
}

export interface SigninResponse {
  mensaje: string;
  usuario: {
    id: string;
    nombre: string;
  };
}