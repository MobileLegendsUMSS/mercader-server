import { Router } from "express";
import * as ResenaController from "../controllers/resena.controller";
import * as Autenticacion from "../middlewares/autenticacion.middleware";

const router = Router();

// Obtener reseñas de un juego (público, requiere token para saber quién es el usuario)
router.get(
  "/juego/:idJuego",
  Autenticacion.autenticarToken,
  ResenaController.getReviewsByGame
);

// Crear una nueva reseña
router.post(
  "/",
  Autenticacion.autenticarToken,
  ResenaController.createReview
);

export default router;