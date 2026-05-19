import { Router } from 'express';
import { autenticarToken } from '../middlewares/autenticacion.middleware';

const router = Router();

// Rutas protegidas para usuarios
// Aquí puedes agregar endpoints para obtener información del usuario actual
// router.get('/perfil', autenticarToken, UserController.getPerfil);

export default router;
