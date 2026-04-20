import { Router } from 'express';
import { editorialController } from '../controllers/editorial.controller';

const router = Router();

router.get('/', editorialController.getAllEditorials);
router.get('/:id', editorialController.getEditorialById);

router.post('/', editorialController.create);

export default router;