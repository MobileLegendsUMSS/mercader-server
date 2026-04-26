import { Router } from 'express';
import { juegoController } from '../controllers/juego.controller';
import * as GameController from "../controllers/juego.controller";

const router = Router();

router.get('/', juegoController.getAllGames);
router.get('/:id', juegoController.getGameById);

router.post('/', juegoController.create);

router.delete("/", GameController.deleteGameById);

export default router