import { Router } from "express";
import * as PrestamoController from "../controllers/prestamo.controller";
import * as Autorizacion from "../middlewares/autenticacion.middleware";

const router = Router();

router.post("/usuarios/prestamo", Autorizacion.autenticarToken, PrestamoController.registerUserLoan);

router.get("/usuarios/prestamos", Autorizacion.autenticarToken, PrestamoController.getUserLoans);

router.patch("/admin/prestamo", Autorizacion.autenticarToken, PrestamoController.updateUserLoan);

router.delete("/usuarios/prestamo", Autorizacion.autenticarToken, PrestamoController.deleteUserLoan);
  
export default router;