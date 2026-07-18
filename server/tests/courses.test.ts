import request from 'supertest';
import express from 'express';
import courseRoutes from '../src/routes/course.routes';
import adminRoutes from '../src/routes/admin.routes';
import { User, Course, Chapter, Lesson } from '../src/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);

let adminToken: string;

beforeAll(async () => {
  await User.destroy({ where: {} });
  await Course.destroy({ where: {} });
  await Chapter.destroy({ where: {} });
  await Lesson.destroy({ where: {} });

  const hashedPassword = await bcrypt.hash('Admin@123456', 10);
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@test.com',
    password: hashedPassword,
    role: 'admin',
    language: 'en',
    theme: 'light',
    isVerified: true,
  } as any);

  adminToken = jwt.sign(
    { id: admin.id, email: admin.email, role: 'admin' },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
});

describe('Course API', () => {
  let courseId: number;

  describe('Admin: Create Course', () => {
    it('should create a course as admin', async () => {
      const res = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('title', 'Test Course')
        .field('titleAr', 'كورس تجريبي')
        .field('description', 'A test course')
        .field('descriptionAr', 'كورس تجريبي')
        .field('price', '100')
        .field('isFree', 'false')
        .field('isPublished', 'true');

      expect(res.status).toBe(201);
      expect(res.body.course).toBeDefined();
      expect(res.body.course.title).toBe('Test Course');
      courseId = res.body.course.id;
    });

    it('should not create course without auth', async () => {
      const res = await request(app)
        .post('/api/admin/courses')
        .field('title', 'Test');

      expect(res.status).toBe(401);
    });
  });

  describe('Public: List Courses', () => {
    it('should list published courses', async () => {
      const res = await request(app).get('/api/courses');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should get course by slug', async () => {
      const res = await request(app).get('/api/courses/test-course');

      expect(res.status).toBe(200);
      expect(res.body.course).toBeDefined();
      expect(res.body.course.title).toBe('Test Course');
    });
  });

  describe('Admin: Create Chapter & Lesson', () => {
    let chapterId: number;

    it('should create a chapter', async () => {
      const res = await request(app)
        .post(`/api/admin/courses/${courseId}/chapters`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Chapter 1', titleAr: 'الفصل الأول', orderIndex: 1 });

      expect(res.status).toBe(201);
      expect(res.body.chapter).toBeDefined();
      chapterId = res.body.chapter.id;
    });

    it('should create a lesson', async () => {
      const res = await request(app)
        .post(`/api/admin/chapters/${chapterId}/lessons`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Lesson 1',
          titleAr: 'الدرس الأول',
          type: 'text',
          content: '<p>Hello World</p>',
          orderIndex: 1,
          isFree: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.lesson).toBeDefined();
      expect(res.body.lesson.title).toBe('Lesson 1');
    });

    it('should get chapters for course', async () => {
      const res = await request(app).get(`/api/courses/${courseId}/chapters`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.chapters)).toBe(true);
      expect(res.body.chapters.length).toBeGreaterThan(0);
    });
  });

  describe('Admin: Delete Course', () => {
    it('should delete course', async () => {
      const res = await request(app)
        .delete(`/api/admin/courses/${courseId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });
  });
});
