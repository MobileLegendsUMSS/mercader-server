import { Router } from "express";
import * as CompraController from "../controllers/compra.controller";

const router = Router();

router.post("/usuarios/compra", CompraController.registerUserPurchase);
router.get("/usuarios/compra", CompraController.getUserPurchases);

export default router;