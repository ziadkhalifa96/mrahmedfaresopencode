import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getExams, getExamDetail, createExam, updateExam, deleteExam, createQuestion, updateQuestion, deleteQuestion } from '../controllers/admin-exams.controller';

const router = Router();
router.use(authenticate);
router.use(authorize('admin'));

router.get('/', getExams);
router.get('/:id', getExamDetail);
router.post('/', createExam);
router.post('/:examId/questions', createQuestion);
router.put('/questions/:questionId', updateQuestion);
router.put('/:id', updateExam);
router.delete('/questions/:questionId', deleteQuestion);
router.delete('/:id', deleteExam);

export default router;
