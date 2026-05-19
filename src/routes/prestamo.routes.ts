import { Router } from "express";
import * as PrestamoController from "../controllers/prestamo.controller";

const router = Router();

router.post("/usuarios/prestamo", PrestamoController.registerUserLoan);

export default router;