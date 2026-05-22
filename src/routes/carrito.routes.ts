import { Router } from "express";
import * as CarritoController from "../controllers/carrito.controller";
import * as Autorizacion from "../middlewares/autenticacion.middleware";

const router = Router();

router.post("/usuarios/carrito", Autorizacion.autenticarToken , CarritoController.registerGameCart);
router.get("/usuarios/carrito", Autorizacion.autenticarToken , CarritoController.viewGamesCart);
router.patch("/usuarios/carrito", Autorizacion.autenticarToken , CarritoController.updateGameCart);
router.delete("/usuarios/carrito", Autorizacion.autenticarToken , CarritoController.deleteGameCart);

export default router;