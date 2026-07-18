import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { LessonProgress, Lesson, Chapter, Enrollment, Certificate } from '../models';
import { generateCertificateNumber } from '../utils/helpers';
import { Op } from 'sequelize';

export const markLessonComplete = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const { lessonId } = req.params;

    const lesson = await Lesson.findByPk(lessonId as string);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const chapter = await Chapter.findByPk(lesson.chapterId);
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

    const [progress, created] = await LessonProgress.findOrCreate({
      where: { userId: req.user.id, lessonId: parseInt(lessonId as string) },
      defaults: {
        userId: req.user.id,
        lessonId: parseInt(lessonId as string),
        completed: true,
        completedAt: new Date(),
      },
    });

    if (!created && !progress.completed) {
      await progress.update({ completed: true, completedAt: new Date() });
    }

    const enrollment = await Enrollment.findOne({
      where: { userId: req.user.id, courseId: chapter.courseId },
    });

    let courseProgress = null;
    if (enrollment) {
      const allChapters = await Chapter.findAll({ where: { courseId: chapter.courseId } });
      const chapterIds = allChapters.map((c) => c.id);
      const totalLessons = chapterIds.length > 0 ? await Lesson.count({ where: { chapterId: chapterIds } }) : 0;
      let completedLessons = 0;
      if (chapterIds.length > 0) {
        const lessonIds = (await Lesson.findAll({ where: { chapterId: chapterIds }, attributes: ['id'] })).map((l) => l.id);
        if (lessonIds.length > 0) {
          completedLessons = await LessonProgress.count({
            where: { userId: req.user.id, completed: true, lessonId: { [Op.in]: lessonIds } },
          });
        }
      }
      const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      courseProgress = { totalLessons, completedLessons, progressPercent };

      if (totalLessons > 0 && completedLessons >= totalLessons && enrollment.status === 'active') {
        await enrollment.update({ status: 'completed', completedAt: new Date() });

        const existingCert = await Certificate.findOne({ where: { userId: req.user.id, courseId: chapter.courseId } });
        if (!existingCert) {
          await Certificate.create({
            userId: req.user.id,
            courseId: chapter.courseId,
            certificateNumber: generateCertificateNumber(),
            issuedAt: new Date(),
          });
        }
      }
    }

    res.json({ message: 'Lesson marked as complete', courseProgress });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to mark lesson complete' });
  }
};

export const getCourseProgress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const { courseId } = req.params;

    const allChapters = await Chapter.findAll({ where: { courseId: parseInt(courseId as string) } });
    const chapterIds = allChapters.map((c) => c.id);
    const allLessons = await Lesson.findAll({ where: { chapterId: chapterIds }, attributes: ['id'] });
    const lessonIds = allLessons.map((l) => l.id);
    const totalLessons = lessonIds.length;

    const completedProgress = await LessonProgress.findAll({
      where: { userId: req.user.id, completed: true, lessonId: lessonIds },
      attributes: ['lessonId'],
    });
    const completedLessonIds = new Set(completedProgress.map((p) => p.lessonId));
    const completedLessons = completedLessonIds.size;
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const chapters = allChapters.map((ch) => ({
      id: ch.id,
      title: ch.title,
      titleAr: ch.titleAr,
      orderIndex: ch.orderIndex,
    }));

    const lessons = allLessons.map((l) => ({
      id: l.id,
      completed: completedLessonIds.has(l.id),
    }));

    res.json({ totalLessons, completedLessons, progressPercent, chapters, lessons });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get progress' });
  }
};
