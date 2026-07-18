import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Exam, ExamQuestion, ExamAttempt, Course } from '../models';

export const getExams = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.query;
    const where: any = {};
    if (courseId) where.courseId = courseId;

    const exams = await Exam.findAll({
      where,
      include: [
        { model: Course, as: 'course', attributes: ['id', 'title', 'titleAr'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ exams });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get exams' });
  }
};

export const getExamDetail = async (req: AuthRequest, res: Response) => {
  try {
    const exam = await Exam.findByPk(req.params.id as string, {
      include: [{ model: Course, as: 'course', attributes: ['id', 'title', 'titleAr'] }],
    });
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    const questions = await ExamQuestion.findAll({
      where: { examId: exam.id },
      order: [['orderIndex', 'ASC']],
    });

    res.json({ exam, questions });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get exam' });
  }
};

export const createExam = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, title, titleAr, description, descriptionAr, duration, passingScore, maxAttempts, isPublished } = req.body;

    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const exam = await Exam.create({
      courseId,
      title,
      titleAr,
      description,
      descriptionAr,
      duration: parseInt(duration) || 60,
      passingScore: parseInt(passingScore) || 50,
      maxAttempts: parseInt(maxAttempts) || 3,
      isPublished: isPublished === 'true' || isPublished === true,
    });

    res.status(201).json({ exam });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create exam' });
  }
};

export const updateExam = async (req: AuthRequest, res: Response) => {
  try {
    const exam = await Exam.findByPk(req.params.id as string);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    const { title, titleAr, description, descriptionAr, duration, passingScore, maxAttempts, isPublished } = req.body;
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (titleAr !== undefined) updates.titleAr = titleAr;
    if (description !== undefined) updates.description = description;
    if (descriptionAr !== undefined) updates.descriptionAr = descriptionAr;
    if (duration !== undefined) updates.duration = parseInt(duration) || 60;
    if (passingScore !== undefined) updates.passingScore = parseInt(passingScore) || 50;
    if (maxAttempts !== undefined) updates.maxAttempts = parseInt(maxAttempts) || 3;
    if (isPublished !== undefined) updates.isPublished = isPublished === 'true' || isPublished === true;

    await exam.update(updates);
    res.json({ exam });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update exam' });
  }
};

export const deleteExam = async (req: AuthRequest, res: Response) => {
  try {
    const exam = await Exam.findByPk(req.params.id as string);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    await ExamAttempt.destroy({ where: { examId: exam.id } });
    await ExamQuestion.destroy({ where: { examId: exam.id } });
    await exam.destroy();
    res.json({ message: 'Exam deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete exam' });
  }
};

export const createQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findByPk(examId as string);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    const { question, questionAr, type, options, correctAnswer, orderIndex } = req.body;

    const q = await ExamQuestion.create({
      examId: parseInt(examId as string),
      question,
      questionAr,
      type: type || 'mcq',
      options,
      correctAnswer,
      orderIndex: parseInt(orderIndex) || 0,
    });

    res.status(201).json({ question: q });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create question' });
  }
};

export const updateQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const q = await ExamQuestion.findByPk(req.params.questionId as string);
    if (!q) return res.status(404).json({ error: 'Question not found' });

    const { question, questionAr, type, options, correctAnswer, orderIndex } = req.body;
    const updates: any = {};
    if (question !== undefined) updates.question = question;
    if (questionAr !== undefined) updates.questionAr = questionAr;
    if (type !== undefined) updates.type = type;
    if (options !== undefined) updates.options = options;
    if (correctAnswer !== undefined) updates.correctAnswer = correctAnswer;
    if (orderIndex !== undefined) updates.orderIndex = parseInt(orderIndex) || 0;

    await q.update(updates);
    res.json({ question: q });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update question' });
  }
};

export const deleteQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const q = await ExamQuestion.findByPk(req.params.questionId as string);
    if (!q) return res.status(404).json({ error: 'Question not found' });

    await q.destroy();
    res.json({ message: 'Question deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete question' });
  }
};
