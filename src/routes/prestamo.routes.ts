import { Router } from "express";
import * as PrestamoController from "../controllers/prestamo.controller";

const router = Router();

router.post("/usuarios/prestamo", PrestamoController.registerUserLoan);

router.get("/usuarios/prestamos", PrestamoController.getUserLoans);

router.patch("/admin/prestamo", PrestamoController.updateUserLoan);

router.delete("/usuarios/prestamo", PrestamoController.deleteUserLoan);

export default router;