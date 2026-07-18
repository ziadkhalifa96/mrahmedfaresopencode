import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';
import { Exam, ExamQuestion, ExamAttempt } from '../models';

export const getExam = async (req: AuthRequest, res: Response) => {
  try {
    const exam = await Exam.findByPk(req.params.id as string);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    if (!exam.isPublished) return res.status(404).json({ error: 'Exam not found' });

    const questions = await ExamQuestion.findAll({
      where: { examId: exam.id },
      order: [['orderIndex', 'ASC']],
      attributes: { exclude: ['correctAnswer'] },
    });

    const attempts = await ExamAttempt.count({
      where: { userId: req.user!.id, examId: exam.id },
    });

    res.json({ exam, questions, attemptsUsed: attempts });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get exam' });
  }
};

export const startAttempt = async (req: AuthRequest, res: Response) => {
  try {
    const exam = await Exam.findByPk(req.params.id as string);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    const attempts = await ExamAttempt.count({
      where: { userId: req.user!.id, examId: exam.id },
    });

    if (attempts >= exam.maxAttempts) {
      return res.status(400).json({ error: 'Max attempts reached' });
    }

    const attempt = await ExamAttempt.create({
      userId: req.user!.id,
      examId: exam.id,
      startedAt: new Date(),
    });

    res.json({ attempt });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to start attempt' });
  }
};

export const submitAttempt = async (req: AuthRequest, res: Response) => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body;

    const attempt = await ExamAttempt.findOne({
      where: { id: attemptId as string, userId: req.user!.id },
    });
    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
    if (attempt.completedAt) return res.status(400).json({ error: 'Attempt already completed' });

    const questions = await ExamQuestion.findAll({
      where: { examId: attempt.examId },
    });

    let correct = 0;
    const gradedAnswers = answers.map((a: any) => {
      const q = questions.find((qq: any) => qq.id === a.questionId);
      const isCorrect = q ? q.correctAnswer === a.selectedOptionId : false;
      if (isCorrect) correct++;
      return { ...a, isCorrect };
    });

    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

    await attempt.update({
      score,
      answers: gradedAnswers,
      completedAt: new Date(),
    });

    const exam = await Exam.findByPk(attempt.examId);
    const passed = score >= (exam?.passingScore || 50);

    res.json({ attempt, score, passed, correct, total: questions.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to submit attempt' });
  }
};
