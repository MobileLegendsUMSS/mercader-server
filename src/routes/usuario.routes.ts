import { Router } from "express";
import * as UsuarioController from "../controllers/usuario.controller";

const router = Router();

router.get("/usuarios/info-personal", UsuarioController.getPersonalInfo);

export default router;