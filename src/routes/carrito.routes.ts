import { Router } from "express";
import * as CarritoController from "../controllers/carrito.controller";

const router = Router();

router.post("/usuarios/carrito", CarritoController.registerGameCart);
router.get("/usuarios/carrito", CarritoController.viewGamesCart);
router.patch("/usuarios/carrito", CarritoController.updateGameCart);
router.delete("/usuarios/carrito", CarritoController.deleteGameCart);

export default router;