import { Router } from 'express';
import * as SigninController from '../controllers/signin.controller';

const router = Router();

// POST /api/auth/signin - Registrar nuevo usuario
router.post('/signin', SigninController.signin);

export default router;
