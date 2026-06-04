import { Router } from "express";
import * as Autenticacion from "../middlewares/autenticacion.middleware";
import * as Autorizacion from "../middlewares/autorizacion.middleware";
import * as ReportesController from "../controllers/reporte.controller";

const router = Router();

router.get(
  "/usuarios/juegos-usados",
  Autenticacion.autenticarToken,
  ReportesController.getTop5MostUsedGamesByUser
);

router.get(
  "/admin/juegos-stock",
  Autenticacion.autenticarToken,
  Autorizacion.verifyAllowedRoles(["admin", "superadmin"]),
  ReportesController.getGamesByStock
);

router.get(
  "/admin/categorias-populares",
  Autenticacion.autenticarToken,
  Autorizacion.verifyAllowedRoles(["admin", "superadmin"]),
  ReportesController.getCategoryPopularity
);

router.get(
  "/superadmin/ingresos-periodo",
  Autenticacion.autenticarToken,
  Autorizacion.verifyAllowedRoles(["superadmin"]),
  ReportesController.getIncomePerPeriod
);

router.get(
  "/superadmin/usos-periodo",
  Autenticacion.autenticarToken,
  Autorizacion.verifyAllowedRoles(["superadmin"]),
  ReportesController.getBorrowsPerPeriod
);

export default router;