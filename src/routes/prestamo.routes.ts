import { Router } from "express";
import * as Autenticacion from "../middlewares/autenticacion.middleware"
import * as Autorizacion from "../middlewares/autorizacion.middleware";
import * as PrestamoController from "../controllers/prestamo.controller";

const router = Router();

router.get(
  "/usuarios/prestamos",
  Autenticacion.autenticarToken,
  PrestamoController.getUserLoans
);

router.post(
  "/usuarios/prestamo",
  Autenticacion.autenticarToken,
  PrestamoController.registerUserLoan
);

router.patch(
  "/admin/prestamo",
  Autenticacion.autenticarToken,
  Autorizacion.verifyAllowedRoles(["admin"]),
  PrestamoController.updateUserLoan
);

router.delete(
  "/usuarios/prestamo",
  Autenticacion.autenticarToken,
  PrestamoController.deleteUserLoan 
);

router.post(
  "/admin/prestamo",
  Autenticacion.autenticarToken,
  Autorizacion.verifyAllowedRoles(["admin"]),
  PrestamoController.getAllLoans 
);

export default router;