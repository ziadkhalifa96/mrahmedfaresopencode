import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getExam, startAttempt, submitAttempt } from '../controllers/exam.controller';

const router = Router();

router.use(authenticate);

router.get('/:id', getExam);
router.post('/:id/start', startAttempt);
router.put('/attempts/:attemptId/submit', submitAttempt);

export default router;
