import { Router } from 'express';
import { juegoController } from '../controllers/juego.controller';
import * as GameController from "../controllers/juego.controller";
import * as Autorizacion from "../middlewares/autenticacion.middleware";

const router = Router();

router.get('/', Autorizacion.autenticarToken, juegoController.getAllGames);
router.get('/:id', Autorizacion.autenticarToken, GameController.getGameById);
router.get("/sistema/recientes", Autorizacion.autenticarToken, GameController.getMostRecentGames);
router.get("/sistema/visitados", Autorizacion.autenticarToken, GameController.getMostVisitedGames);
router.get("/sistema/comprados", Autorizacion.autenticarToken, GameController.getMostSelledGames);
router.get("/sistema/prestados", Autorizacion.autenticarToken, GameController.getMostBorrowedGames);

router.post('/', Autorizacion.autenticarToken, GameController.createGame);

router.delete("/", Autorizacion.autenticarToken, GameController.deleteGameById);

router.patch("/", Autorizacion.autenticarToken, GameController.updateGameById);

export default router;