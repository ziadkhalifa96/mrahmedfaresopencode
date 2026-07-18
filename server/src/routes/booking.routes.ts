import { Router } from 'express';
import { getAvailableBookings, getMyBookings, bookSeat, cancelBooking } from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/available', getAvailableBookings);
router.get('/my', authenticate, getMyBookings);
router.post('/', authenticate, bookSeat);
router.put('/:bookingId/cancel', authenticate, cancelBooking);

export default router;
