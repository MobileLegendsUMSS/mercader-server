import { Router } from 'express';
import * as LoginController from '../controllers/login.controller';

const router = Router();

// POST /api/auth/login - Autenticar usuario
router.post('/login', LoginController.login);

export default router;
