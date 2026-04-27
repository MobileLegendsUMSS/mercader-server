import { Router } from 'express';
import * as RentalController from '../controllers/rental.controller';

const router = Router();

router.post('/', RentalController.createRental);
router.get('/', RentalController.getRentalsByGame);
router.put('/cancel', RentalController.cancelRental);

export default router;
