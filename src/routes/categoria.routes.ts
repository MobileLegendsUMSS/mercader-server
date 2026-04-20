import { Router } from 'express';
import { categoriaController } from '../controllers/categoria.controller';

const router = Router();

router.get('/', categoriaController.getAllCategories);
router.get('/:id', categoriaController.getCategoryById);
router.get('/:id/juegos', categoriaController.getGamesByCategory);

router.post('/', categoriaController.create);

export default router;