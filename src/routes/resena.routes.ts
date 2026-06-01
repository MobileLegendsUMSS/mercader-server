import { Router } from "express";
import * as ResenaController from "../controllers/resena.controller";
import * as Autorizacion from "../middlewares/autenticacion.middleware";

const router = Router();

// Obtener reseñas de un juego (público, requiere token para saber quién es el usuario)
router.get(
  "/juego/:idJuego",
  Autorizacion.autenticarToken,
  ResenaController.getReviewsByGame
);

// Crear una nueva reseña
router.post(
  "/",
  Autorizacion.autenticarToken,
  ResenaController.createReview
);

export default router;