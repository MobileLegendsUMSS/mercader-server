import { Router } from "express";
import * as Autorizacion from "../middlewares/autenticacion.middleware";
import * as MulterCheck from "../middlewares/multer.middleware";
import * as CompraController from "../controllers/compra.controller";

const router = Router();

router.post(
  "/usuarios/compra",
  Autorizacion.autenticarToken,
  MulterCheck.checkPaymentProofImageErrors,
  CompraController.registerUserPurchase
);

router.get(
  "/usuarios/compra",
  Autorizacion.autenticarToken,
  CompraController.getUserPurchases
);

export default router;