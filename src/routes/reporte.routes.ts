import { Router } from "express";
import * as Autorizacion from "../middlewares/autenticacion.middleware";
import * as ReportesController from "../controllers/reporte.controller";

const router = Router();

router.get(
  "/usuarios/juegos-usados",
  Autorizacion.autenticarToken,
  ReportesController.getTop5MostUsedGamesByUser
);

router.get(
  "/admin/juegos-stock",
  Autorizacion.autenticarToken,
  ReportesController.getGamesByStock
);

router.get(
  "/admin/categorias-populares",
  Autorizacion.autenticarToken,
  ReportesController.getCategoryPopularity
);

export default router;