import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';
import { Course, Chapter, Lesson, Enrollment } from '../models';
import { generateSlug } from '../utils/helpers';

export const getCourses = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '20', search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { titleAr: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows, count } = await Course.findAndCountAll({
      where,
      include: [
        { model: Chapter, as: 'chapters', attributes: ['id'] },
      ],
      order: [['orderIndex', 'ASC']],
      limit: limitNum,
      offset,
    });

    const coursesWithCount = rows.map((course: any) => ({
      ...course.toJSON(),
      chapterCount: course.chapters?.length || 0,
    }));

    res.json({ courses: coursesWithCount, total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get courses' });
  }
};

export const getCourse = async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.findByPk(req.params.id as string, {
      include: [
        {
          model: Chapter,
          as: 'chapters',
          include: [{ model: Lesson, as: 'lessons' }],
          order: [['orderIndex', 'ASC']],
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

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { title, titleAr, description, descriptionAr, price, isFree, isPublished, orderIndex } = req.body;
    const slug = generateSlug(title);

    const existing = await Course.findOne({ where: { slug } });
    if (existing) return res.status(409).json({ error: 'Course with this slug already exists' });

    const thumbnail = req.file ? `/uploads/courses/${req.file.filename}` : undefined;

    const course = await Course.create({
      title, titleAr, description, descriptionAr, slug,
      price: parseFloat(price) || 0,
      isFree: isFree === 'true' || isFree === true,
      isPublished: isPublished === 'true' || isPublished === true,
      orderIndex: parseInt(orderIndex) || 0,
      thumbnail,
    });

    res.status(201).json({ course });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create course' });
  }
};

export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.findByPk(req.params.id as string);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const { title, titleAr, description, descriptionAr, price, isFree, isPublished, orderIndex } = req.body;
    const updates: any = {};

    if (title !== undefined) { updates.title = title; updates.slug = generateSlug(title); }
    if (titleAr !== undefined) updates.titleAr = titleAr;
    if (description !== undefined) updates.description = description;
    if (descriptionAr !== undefined) updates.descriptionAr = descriptionAr;
    if (price !== undefined) updates.price = parseFloat(price) || 0;
    if (isFree !== undefined) updates.isFree = isFree === 'true' || isFree === true;
    if (isPublished !== undefined) updates.isPublished = isPublished === 'true' || isPublished === true;
    if (orderIndex !== undefined) updates.orderIndex = parseInt(orderIndex) || 0;
    if (req.file) updates.thumbnail = `/uploads/courses/${req.file.filename}`;

    await course.update(updates);
    res.json({ course });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update course' });
  }
};

export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.findByPk(req.params.id as string);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const enrollmentCount = await Enrollment.count({ where: { courseId: course.id } });
    if (enrollmentCount > 0) {
      return res.status(400).json({ error: 'Cannot delete course with active enrollments' });
    }

    await Lesson.destroy({ where: { chapterId: { [Op.in]: (await Chapter.findAll({ where: { courseId: course.id }, attributes: ['id'] })).map((c: any) => c.id) } } });
    await Chapter.destroy({ where: { courseId: course.id } });
    await course.destroy();
    res.json({ message: 'Course deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete course' });
  }
};

export const createChapter = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findByPk(courseId as string);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const { title, titleAr, orderIndex } = req.body;
    const chapter = await Chapter.create({
      courseId: parseInt(courseId as string),
      title, titleAr,
      orderIndex: parseInt(orderIndex) || 0,
    });

    res.status(201).json({ chapter });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create chapter' });
  }
};

export const updateChapter = async (req: AuthRequest, res: Response) => {
  try {
    const chapter = await Chapter.findByPk(req.params.chapterId as string);
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

    const { title, titleAr, orderIndex } = req.body;
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (titleAr !== undefined) updates.titleAr = titleAr;
    if (orderIndex !== undefined) updates.orderIndex = parseInt(orderIndex) || 0;

    await chapter.update(updates);
    res.json({ chapter });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update chapter' });
  }
};

export const deleteChapter = async (req: AuthRequest, res: Response) => {
  try {
    const chapter = await Chapter.findByPk(req.params.chapterId as string);
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

    await Lesson.destroy({ where: { chapterId: chapter.id } });
    await chapter.destroy();
    res.json({ message: 'Chapter deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete chapter' });
  }
};

export const createLesson = async (req: AuthRequest, res: Response) => {
  try {
    const { chapterId } = req.params;
    const chapter = await Chapter.findByPk(chapterId as string);
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

    const { title, titleAr, type, content, contentAr, videoUrl, duration, orderIndex, isFree } = req.body;
    const lesson = await Lesson.create({
      chapterId: parseInt(chapterId as string),
      title, titleAr,
      type: type || 'text',
      content, contentAr, videoUrl,
      duration: parseInt(duration) || 0,
      orderIndex: parseInt(orderIndex) || 0,
      isFree: isFree === 'true' || isFree === true,
    });

    res.status(201).json({ lesson });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create lesson' });
  }
};

export const updateLesson = async (req: AuthRequest, res: Response) => {
  try {
    const lesson = await Lesson.findByPk(req.params.lessonId as string);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const { title, titleAr, type, content, contentAr, videoUrl, duration, orderIndex, isFree } = req.body;
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (titleAr !== undefined) updates.titleAr = titleAr;
    if (type !== undefined) updates.type = type;
    if (content !== undefined) updates.content = content;
    if (contentAr !== undefined) updates.contentAr = contentAr;
    if (videoUrl !== undefined) updates.videoUrl = videoUrl;
    if (duration !== undefined) updates.duration = parseInt(duration) || 0;
    if (orderIndex !== undefined) updates.orderIndex = parseInt(orderIndex) || 0;
    if (isFree !== undefined) updates.isFree = isFree === 'true' || isFree === true;

    await lesson.update(updates);
    res.json({ lesson });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update lesson' });
  }
};

export const deleteLesson = async (req: AuthRequest, res: Response) => {
  try {
    const lesson = await Lesson.findByPk(req.params.lessonId as string);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    await lesson.destroy();
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete lesson' });
  }
};
