import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { markLessonComplete, getCourseProgress } from '../controllers/progress.controller';

const router = Router();
router.use(authenticate);

router.post('/lessons/:lessonId/complete', markLessonComplete);
router.get('/courses/:courseId', getCourseProgress);

export default router;
