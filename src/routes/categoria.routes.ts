import { Router } from 'express';
import { categoriaController } from '../controllers/categoria.controller';
import * as Autorizacion from "../middlewares/autenticacion.middleware";

const router = Router();

router.get('/', Autorizacion.autenticarToken, categoriaController.getAllCategories);
router.get('/:id', Autorizacion.autenticarToken, categoriaController.getCategoryById);
router.get('/:id/juegos', Autorizacion.autenticarToken, categoriaController.getGamesByCategory);

router.post('/', Autorizacion.autenticarToken, categoriaController.create);

export default router;