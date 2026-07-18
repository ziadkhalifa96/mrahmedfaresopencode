import request from 'supertest';
import express from 'express';
import examRoutes from '../src/routes/exam.routes';
import adminExamRoutes from '../src/routes/admin-exams.routes';
import authRoutes from '../src/routes/auth.routes';
import { User, Course, Exam, ExamQuestion } from '../src/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/admin/exams', adminExamRoutes);

let adminToken: string;
let studentToken: string;
let courseId: number;
let examId: number;

beforeAll(async () => {
  await ExamQuestion.destroy({ where: {} });
  await Exam.destroy({ where: {} });
  await Course.destroy({ where: {} });
  await User.destroy({ where: {} });

  const hashedPassword = await bcrypt.hash('Admin@123456', 10);

  const admin = await User.create({
    name: 'Admin', email: 'admin@test.com', password: hashedPassword,
    role: 'admin', language: 'en', theme: 'light', isVerified: true,
  } as any);

  const student = await User.create({
    name: 'Student', email: 'student@test.com', password: hashedPassword,
    role: 'student', language: 'en', theme: 'light', isVerified: true,
  } as any);

  adminToken = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '1h' });
  studentToken = jwt.sign({ id: student.id, email: student.email, role: 'student' }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '1h' });

  const course = await Course.create({
    title: 'Exam Course', titleAr: 'كورس الامتحانات', description: 'Test', descriptionAr: 'test',
    slug: 'exam-course', price: 0, isFree: true, isPublished: true, orderIndex: 1,
  } as any);
  courseId = course.id;
});

describe('Exam API', () => {
  describe('Admin: Create Exam', () => {
    it('should create an exam', async () => {
      const res = await request(app)
        .post('/api/admin/exams')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          courseId, title: 'Midterm', titleAr: 'الامتحان النصفي',
          duration: 60, passingScore: 50, maxAttempts: 3, isPublished: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.exam).toBeDefined();
      examId = res.body.exam.id;
    });
  });

  describe('Admin: Add Questions', () => {
    it('should add MCQ question', async () => {
      const res = await request(app)
        .post(`/api/admin/exams/${examId}/questions`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          question: 'What is 2+2?',
          questionAr: 'كم يساوي 2+2؟',
          type: 'mcq',
          options: [
            { id: 'a', text: '3', textAr: '3' },
            { id: 'b', text: '4', textAr: '4' },
            { id: 'c', text: '5', textAr: '5' },
          ],
          correctAnswer: 'b',
          orderIndex: 1,
        });

      expect(res.status).toBe(201);
      expect(res.body.question).toBeDefined();
      expect(res.body.question.correctAnswer).toBe('b');
    });

    it('should add true/false question', async () => {
      const res = await request(app)
        .post(`/api/admin/exams/${examId}/questions`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          question: 'The sky is blue',
          questionAr: 'السماء زرقاء',
          type: 'true_false',
          options: [
            { id: 'a', text: 'True', textAr: 'صح' },
            { id: 'b', text: 'False', textAr: 'خطأ' },
          ],
          correctAnswer: 'a',
          orderIndex: 2,
        });

      expect(res.status).toBe(201);
    });
  });

  describe('Student: Take Exam', () => {
    it('should get exam for student', async () => {
      const res = await request(app)
        .get(`/api/exams/${examId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.exam).toBeDefined();
      expect(res.body.questions).toBeDefined();
      expect(res.body.questions.length).toBe(2);
      // Should NOT include correctAnswer
      expect(res.body.questions[0].correctAnswer).toBeUndefined();
    });

    it('should start exam attempt', async () => {
      const res = await request(app)
        .post(`/api/exams/${examId}/start`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(201);
      expect(res.body.attempt).toBeDefined();
    });
  });
});
