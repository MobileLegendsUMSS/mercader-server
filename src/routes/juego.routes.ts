import { Router } from 'express';
import * as GameController from "../controllers/juego.controller";
import * as Autenticacion from "../middlewares/autenticacion.middleware";
import * as Autorizacion from "../middlewares/autorizacion.middleware";
import * as MulterCheck from "../middlewares/multer.middleware";

const router = Router();

router.get(
  "/", 
  Autenticacion.autenticarToken,
  GameController.getAllGames
);

router.get(
  "/:id",
  Autenticacion.autenticarToken,
  GameController.getGameById
);
router.get('/', Autorizacion.autenticarToken, juegoController.getAllGames);

router.get('/:id', Autorizacion.autenticarToken, GameController.getGameById);

router.get('/servicios', Autorizacion.autenticarToken, GameController.getGameServices);

router.post('/', Autorizacion.autenticarToken, GameController.createGame);

router.get(
  "/sistema/recientes",
  Autenticacion.autenticarToken,
  GameController.getMostRecentGames
);

router.get(
  "/sistema/visitados",
  Autenticacion.autenticarToken,
  GameController.getMostVisitedGames
);

router.get(
  "/sistema/comprados",
  Autenticacion.autenticarToken,
  GameController.getMostSelledGames
);

router.get(
  "/sistema/prestados",
  Autenticacion.autenticarToken,
  GameController.getMostBorrowedGames
);

router.post(
  "/",
  Autenticacion.autenticarToken,
  Autorizacion.verifyAllowedRoles(["admin", "superadmin"]),
  MulterCheck.checkGameImageErrors,
  GameController.createGame
);

router.delete(
  "/",
  Autenticacion.autenticarToken,
  Autorizacion.verifyAllowedRoles(["admin", "superadmin"]),
  GameController.deleteGameById
);

router.patch(
  "/",
  Autenticacion.autenticarToken,
  Autorizacion.verifyAllowedRoles(["admin", "superadmin"]),
  MulterCheck.checkGameImageErrors,
  GameController.updateGameById
);

export default router;