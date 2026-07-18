import { Router } from 'express';
import { getPublishedCourses, getCourseBySlug, getChapters, getLesson, getExams } from '../controllers/course.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getPublishedCourses);
router.get('/lessons/:lessonId', authenticate, getLesson);
router.get('/:slug', getCourseBySlug);
router.get('/:courseId/chapters', getChapters);
router.get('/:courseId/exams', authenticate, getExams);

export default router;
