import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Enrollment, Course, Chapter, Lesson, LessonProgress } from '../models';

export const getMyEnrollments = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const enrollments = await Enrollment.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'titleAr', 'slug', 'thumbnail', 'description', 'descriptionAr'],
        },
      ],
      order: [['enrolledAt', 'DESC']],
    });

    res.json({ enrollments });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get enrollments' });
  }
};

export const enroll = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const { courseId } = req.body;

    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const existingEnrollment = await Enrollment.findOne({
      where: { userId: req.user.id, courseId },
    });
    if (existingEnrollment) {
      return res.status(409).json({ error: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      userId: req.user.id,
      courseId,
      status: 'active',
      enrolledAt: new Date(),
    });

    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to enroll' });
  }
};

export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const { enrollmentId } = req.params;
    const { lessonId } = req.body;

    const enrollment = await Enrollment.findOne({
      where: { id: enrollmentId, userId: req.user.id },
    });
    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });

    const [progress, created] = await LessonProgress.findOrCreate({
      where: { userId: req.user.id, lessonId },
      defaults: {
        userId: req.user.id,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
    });

    if (!created && !progress.completed) {
      await progress.update({ completed: true, completedAt: new Date() });
    }

    // Calculate total progress
    const course = await Course.findByPk(enrollment.courseId, {
      include: [
        {
          model: Chapter,
          as: 'chapters',
          include: [
            {
              model: Lesson,
              as: 'lessons',
              attributes: ['id'],
            },
          ],
        },
      ],
    });

    const totalLessons = ((course as any)?.chapters || []).reduce(
      (acc: number, ch: any) => acc + (ch.lessons?.length || 0),
      0
    );

    const completedLessons = await LessonProgress.count({
      where: {
        userId: req.user.id,
        completed: true,
      },
      include: [
        {
          model: Lesson,
          as: 'lesson',
          include: [
            {
              model: Chapter,
              as: 'chapter',
              where: { courseId: enrollment.courseId },
            },
          ],
        },
      ],
    });

    if (totalLessons > 0 && completedLessons >= totalLessons) {
      await enrollment.update({ status: 'completed', completedAt: new Date() });
    }

    res.json({ message: 'Progress updated', progress });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update progress' });
  }
};

export const getEnrollmentStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findOne({
      where: { id: enrollmentId, userId: req.user.id },
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: Chapter,
              as: 'chapters',
              include: [
                {
                  model: Lesson,
                  as: 'lessons',
                  attributes: ['id', 'title', 'titleAr'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });

    const course = (enrollment as any).course;
    const totalLessons = (course?.chapters || []).reduce(
      (acc: number, ch: any) => acc + (ch.lessons?.length || 0),
      0
    );

    const completedLessons = await LessonProgress.count({
      where: { userId: req.user.id, completed: true },
      include: [
        {
          model: Lesson,
          as: 'lesson',
          include: [
            {
              model: Chapter,
              as: 'chapter',
              where: { courseId: enrollment.courseId },
            },
          ],
        },
      ],
    });

    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    res.json({
      enrollment,
      stats: {
        totalLessons,
        completedLessons,
        progress,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get stats' });
  }
};
