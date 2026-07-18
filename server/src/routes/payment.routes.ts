import { Router } from 'express';
import { getMyPayments, submitPayment } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';
import { upload } from '../utils/upload';

const router = Router();

router.get('/my', authenticate, getMyPayments);
router.post('/', authenticate, upload.single('proofImage'), submitPayment);

export default router;
