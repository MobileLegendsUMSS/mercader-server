export interface TokenPayload {
  id_usuario: string;
  nombre: string;
  rol: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: TokenPayload;
  }
}