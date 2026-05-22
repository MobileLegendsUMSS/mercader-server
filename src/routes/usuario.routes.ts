import { Router } from "express";
import * as Autorizacion from "../middlewares/autenticacion.middleware";
import * as UsuarioController from "../controllers/usuario.controller";

const router = Router();

router.get(
  "/usuarios/info-personal",
  Autorizacion.autenticarToken,
  UsuarioController.getPersonalInfo
);

router.patch(
  "/usuarios/info-personal",
  Autorizacion.autenticarToken,
  UsuarioController.updatePersonalInfo
)

router.post(
  "/usuarios/favoritos",
  Autorizacion.autenticarToken,
  UsuarioController.registerFavoriteGame
);

router.get(
  "/usuarios/favoritos",
  Autorizacion.autenticarToken,
  UsuarioController.getFavoriteGames
);

router.delete(
  "/usuarios/favoritos",
  Autorizacion.autenticarToken,
  UsuarioController.deleteFavoriteGame
);

export default router;