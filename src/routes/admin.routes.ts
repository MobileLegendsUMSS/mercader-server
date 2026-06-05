import { Router } from "express";
import { autenticarToken } from "../middlewares/autenticacion.middleware";
import { verifyAllowedRoles } from "../middlewares/autorizacion.middleware";
import * as AdminController from "../controllers/admin.controller";

const router = Router();

router.use(autenticarToken);
router.use(verifyAllowedRoles(['superadmin', 'admin']));

router.get('/usuarios', AdminController.listarUsuarios);

router.put('/usuarios/rol', verifyAllowedRoles(['superadmin']), AdminController.cambiarRol);

router.put('/superadmin/degradar', verifyAllowedRoles(['superadmin']), AdminController.degradarSuperAdmin);

export default router;