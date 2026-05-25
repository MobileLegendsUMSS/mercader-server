import { Router } from 'express';
import { dificultadController } from '../controllers/dificultad.controller';
import * as Autorizacion from "../middlewares/autenticacion.middleware";

const router = Router();

// Rutas publicas
router.get('/', Autorizacion.autenticarToken, dificultadController.getAllDifficulties);
router.get('/:id', Autorizacion.autenticarToken, dificultadController.getDifficultyById);
router.get('/:id/juegos', Autorizacion.autenticarToken, dificultadController.getGamesByDifficulty);

router.post('/', Autorizacion.autenticarToken, dificultadController.create);
router.delete('/', Autorizacion.autenticarToken, dificultadController.delete);

export default router;