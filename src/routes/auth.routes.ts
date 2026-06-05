import { Router } from 'express';
import * as LoginController from '../controllers/login.controller';
import * as SigninController from '../controllers/signin.controller';
import * as RefreshTokenController from '../controllers/refreshToken.controller';

const router = Router();

// POST /api/auth/login - Autenticar usuario
router.post('/login', LoginController.login);

// POST /api/auth/signin - Registrar nuevo usuario
router.post('/signin', SigninController.signin);

router.post('/refresh', RefreshTokenController.refreshToken);

// POST /api/auth/logout - Cerrar sesión (NUEVO)
router.post('/logout', RefreshTokenController.logout);

export default router;