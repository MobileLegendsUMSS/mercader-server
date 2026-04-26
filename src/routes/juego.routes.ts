import { Router } from 'express';
import { juegoController } from '../controllers/juego.controller';
import * as GameController from "../controllers/juego.controller";

const router = Router();

router.get('/', juegoController.getAllGames);
router.get('/:id', juegoController.getGameById);

router.post('/', GameController.createGame);

router.delete("/", GameController.deleteGameById);

export default router