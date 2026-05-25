import { Router } from 'express';
import * as LoginController from '../controllers/login.controller';
import * as SigninController from '../controllers/signin.controller';

const router = Router();

// POST /api/auth/login - Autenticar usuario
router.post('/login', LoginController.login);

// POST /api/auth/signin - Registrar nuevo usuario
router.post('/signin', SigninController.signin);

export default router;
