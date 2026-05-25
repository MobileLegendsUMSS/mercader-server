import { Router } from 'express';
import { editorialController } from '../controllers/editorial.controller';
import * as Autorizacion from "../middlewares/autenticacion.middleware";

const router = Router();

router.get('/', Autorizacion.autenticarToken, editorialController.getAllEditorials);
router.get('/:id', Autorizacion.autenticarToken, editorialController.getEditorialById);

router.post('/', Autorizacion.autenticarToken, editorialController.create);

export default router;