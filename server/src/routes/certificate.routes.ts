import { Router } from 'express';
import { getMyCertificates } from '../controllers/certificate.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/my', authenticate, getMyCertificates);

export default router;
