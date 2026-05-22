import { Router } from "express";
import * as CompraController from "../controllers/compra.controller";
import * as Autorizacion from "../middlewares/autenticacion.middleware";

const router = Router();

router.post("/usuarios/compra", Autorizacion.autenticarToken, CompraController.registerUserPurchase);
router.get("/usuarios/compra", Autorizacion.autenticarToken, CompraController.getUserPurchases);

export default router;