import { Router } from "express";
import * as Autenticacion from "../middlewares/autenticacion.middleware";
import * as UsuarioController from "../controllers/usuario.controller";

const router = Router();

router.get(
  "/usuarios/info-personal",
  Autenticacion.autenticarToken,
  UsuarioController.getPersonalInfo
);

router.patch(
  "/usuarios/info-personal",
  Autenticacion.autenticarToken,
  UsuarioController.updatePersonalInfo
)

router.post(
  "/usuarios/favoritos",
  Autenticacion.autenticarToken,
  UsuarioController.registerFavoriteGame
);

router.get(
  "/usuarios/favoritos",
  Autenticacion.autenticarToken,
  UsuarioController.getFavoriteGames
);

router.delete(
  "/usuarios/favoritos",
  Autenticacion.autenticarToken,
  UsuarioController.deleteFavoriteGame
);

export default router;