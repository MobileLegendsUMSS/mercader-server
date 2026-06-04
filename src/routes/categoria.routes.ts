import { Router } from 'express';
import { categoriaController } from '../controllers/categoria.controller';
import * as Autenticacion from "../middlewares/autenticacion.middleware";

const router = Router();

router.get(
  "/",
  Autenticacion.autenticarToken,
  categoriaController.getAllCategories
);

router.get(
  "/:id",
  Autenticacion.autenticarToken,
  categoriaController.getCategoryById
);

router.get(
  "/:id/juegos",
  Autenticacion.autenticarToken,
  categoriaController.getGamesByCategory
);

router.post(
  "/",
  Autenticacion.autenticarToken,
  categoriaController.create
);

export default router;