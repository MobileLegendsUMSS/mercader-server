import { Router } from "express";
import * as PrestamoController from "../controllers/prestamo.controller";
import * as Autorizacion from "../middlewares/autenticacion.middleware";

const router = Router();

router.get(
  "/usuarios/prestamos",
  Autorizacion.autenticarToken,
  PrestamoController.getUserLoans
);

router.post(
  "/usuarios/prestamo",
  Autorizacion.autenticarToken,
  PrestamoController.registerUserLoan
);

router.patch(
  "/admin/prestamo",
  Autorizacion.autenticarToken,
  PrestamoController.updateUserLoan
);

router.delete(
  "/usuarios/prestamo",
  Autorizacion.autenticarToken,
  PrestamoController.deleteUserLoan
);

router.get(
  "/admin/prestamo",
  Autorizacion.autenticarToken,
  PrestamoController.getAllLoans 
);

export default router;