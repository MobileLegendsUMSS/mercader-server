import { Router } from 'express';
import { dificultadController } from '../controllers/dificultad.controller';

const router = Router();

// Rutas publicas
router.get('/', dificultadController.getAllDifficulties);
router.get('/:id', dificultadController.getDifficultyById);
router.get('/:id/juegos', dificultadController.getGamesByDifficulty);

router.post('/', dificultadController.create);
router.delete('/', dificultadController.delete);

export default router;