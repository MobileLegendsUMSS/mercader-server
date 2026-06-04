import { Router } from 'express';
import { dificultadController } from '../controllers/dificultad.controller';
import * as Autenticacion from "../middlewares/autenticacion.middleware";

const router = Router();

// Rutas publicas
router.get(
  "/",
  Autenticacion.autenticarToken,
  dificultadController.getAllDifficulties
);

router.get(
  "/:id",
  Autenticacion.autenticarToken,
  dificultadController.getDifficultyById
);

router.get(
  "/:id/juegos",
  Autenticacion.autenticarToken,
  dificultadController.getGamesByDifficulty
);

router.post(
  "/",
  Autenticacion.autenticarToken,
  dificultadController.create
);

router.delete(
  "/",
  Autenticacion.autenticarToken,
  dificultadController.delete
);

export default router;