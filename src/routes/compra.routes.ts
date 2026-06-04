import { Router } from "express";
import * as Autenticacion from "../middlewares/autenticacion.middleware";
import * as Autorizacion from "../middlewares/autorizacion.middleware";
import * as MulterCheck from "../middlewares/multer.middleware";
import * as CompraController from "../controllers/compra.controller";

const router = Router();

router.post(
  "/usuarios/compra",
  Autenticacion.autenticarToken,
  MulterCheck.checkPaymentProofImageErrors,
  CompraController.registerUserPurchase
);

router.get(
  "/usuarios/compra",
  Autenticacion.autenticarToken,
  CompraController.getUserPurchases
);

router.get(
  "/admin/compras",
  Autenticacion.autenticarToken,
  Autorizacion.verifyAllowedRoles(["admin", "superadmin"]),
  CompraController.getAllPurchases
);

router.get(
  "/admin/compra",
  Autenticacion.autenticarToken,
  Autorizacion.verifyAllowedRoles(["admin", "superadmin"]),
  CompraController.getPurchaseById
);

router.patch(
  "/admin/aceptar-compra",
  Autenticacion.autenticarToken,
  Autorizacion.verifyAllowedRoles(["admin", "superadmin"]),
  CompraController.allowPurchase
);

export default router;