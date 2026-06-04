import { Router } from 'express';
import { editorialController } from '../controllers/editorial.controller';
import * as Autenticacion from "../middlewares/autenticacion.middleware";

const router = Router();

router.get(
  "/",
  Autenticacion.autenticarToken,
  editorialController.getAllEditorials
);

router.get(
  "/:id",
  Autenticacion.autenticarToken,
  editorialController.getEditorialById
);

router.post(
  "/",
  Autenticacion.autenticarToken,
  editorialController.create
);

export default router;