import { Response } from 'express';
import { Op } from 'sequelize';
import { Course, Chapter, Lesson } from '../models';

export const getPublishedCourses = async (req: any, res: Response) => {
  try {
    const { page = '1', limit = '12', search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const where: any = { isPublished: true };
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { titleAr: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows, count } = await Course.findAndCountAll({
      where,
      include: [{ model: Chapter, as: 'chapters', attributes: ['id'] }],
      order: [['orderIndex', 'ASC'], ['createdAt', 'DESC']],
      limit: limitNum,
      offset,
    });

    const courses = rows.map((course: any) => ({
      ...course.toJSON(),
      chapterCount: course.chapters?.length || 0,
    }));

    res.json({ data: courses, total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get courses' });
  }
};

export const getCourseBySlug = async (req: any, res: Response) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({
      where: { slug, isPublished: true },
      include: [
        {
          model: Chapter,
          as: 'chapters',
          order: [['orderIndex', 'ASC']],
          include: [
            {
              model: Lesson,
              as: 'lessons',
              attributes: ['id', 'title', 'titleAr', 'type', 'duration', 'orderIndex', 'isFree'],
              order: [['orderIndex', 'ASC']],
            },
          ],
        },
      ],
      order: [[{ model: Chapter, as: 'chapters' }, 'orderIndex', 'ASC']],
    });

    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ course });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get course' });
  }
};

export const getChapters = async (req: any, res: Response) => {
  try {
    const { courseId } = req.params;
    const chapters = await Chapter.findAll({
      where: { courseId },
      include: [
        {
          model: Lesson,
          as: 'lessons',
          attributes: ['id', 'title', 'titleAr', 'type', 'duration', 'orderIndex', 'isFree'],
        },
      ],
      order: [['orderIndex', 'ASC']],
    });

    res.json({ chapters });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get chapters' });
  }
};

export const getLesson = async (req: any, res: Response) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const chapter = await Chapter.findByPk(lesson.chapterId);
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

    const course = await Course.findByPk(chapter.courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const lessons = await Lesson.findAll({
      where: { chapterId: chapter.id },
      order: [['orderIndex', 'ASC']],
      attributes: ['id', 'title', 'titleAr', 'type', 'duration', 'orderIndex', 'isFree'],
    });

    res.json({
      lesson,
      chapter: { id: chapter.id, title: chapter.title, titleAr: chapter.titleAr },
      course: { id: course.id, title: course.title, titleAr: course.titleAr, slug: course.slug },
      siblings: lessons,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get lesson' });
  }
};

export const getExams = async (req: any, res: Response) => {
  try {
    const { courseId } = req.params;
    const exams = await require('../models').Exam.findAll({
      where: { courseId, isPublished: true },
      attributes: { exclude: [] },
    });
    res.json({ exams });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get exams' });
  }
};
