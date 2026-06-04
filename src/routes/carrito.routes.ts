import { Router } from "express";
import * as CarritoController from "../controllers/carrito.controller";
import * as Autenticacion from "../middlewares/autenticacion.middleware";

const router = Router();

router.post(
  "/usuarios/carrito",
  Autenticacion.autenticarToken, 
  CarritoController.registerGameCart
);

router.get(
  "/usuarios/carrito",
  Autenticacion.autenticarToken,
  CarritoController.viewGamesCart
);

router.patch(
  "/usuarios/carrito",
  Autenticacion.autenticarToken, 
  CarritoController.updateGameCart
);

router.delete(
  "/usuarios/carrito",
  Autenticacion.autenticarToken,
  CarritoController.deleteGameCart
);

export default router;