import { Router } from "express";
import * as UsuarioController from "../controllers/usuario.controller";

const router = Router();

router.get("/usuarios/perfil", UsuarioController.getPersonalInfo);

export default router;