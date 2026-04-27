import { Router } from 'express';
import * as ReservationController from '../controllers/reservation.controller';

const router = Router();

router.post('/', ReservationController.createReservation);
router.get('/', ReservationController.getReservationsByGame);
router.put('/cancel', ReservationController.cancelReservation);

export default router;
