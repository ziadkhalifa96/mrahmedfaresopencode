import { Router } from 'express';
import { getMyEnrollments, enroll, updateProgress, getEnrollmentStats } from '../controllers/enrollment.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getMyEnrollments);
router.post('/', authenticate, enroll);
router.put('/:enrollmentId/progress', authenticate, updateProgress);
router.get('/:enrollmentId/stats', authenticate, getEnrollmentStats);

export default router;
