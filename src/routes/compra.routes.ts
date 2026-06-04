import { Router } from "express";
import * as Autenticacion from "../middlewares/autenticacion.middleware";
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

export default router;