import { Types } from "mongoose";

export interface TokenPayload {
  id_usuario: Types.ObjectId;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: TokenPayload;
  }
}