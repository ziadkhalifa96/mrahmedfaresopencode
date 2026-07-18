import { z } from 'zod';

export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255),
    titleAr: z.string().min(1).max(255),
    description: z.string().min(1),
    descriptionAr: z.string().min(1),
    price: z.coerce.number().min(0).optional(),
    isFree: z.coerce.boolean().optional(),
    isPublished: z.coerce.boolean().optional(),
    orderIndex: z.coerce.number().int().optional(),
  }),
});

export const updateCourseSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    titleAr: z.string().min(1).max(255).optional(),
    description: z.string().min(1).optional(),
    descriptionAr: z.string().min(1).optional(),
    price: z.coerce.number().min(0).optional(),
    isFree: z.coerce.boolean().optional(),
    isPublished: z.coerce.boolean().optional(),
    orderIndex: z.coerce.number().int().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Course ID must be a number'),
  }),
});

export const chapterSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255),
    titleAr: z.string().min(1).max(255),
    orderIndex: z.coerce.number().int().optional(),
  }),
  params: z.object({
    courseId: z.string().regex(/^\d+$/, 'Course ID must be a number'),
  }),
});

export const updateChapterSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    titleAr: z.string().min(1).max(255).optional(),
    orderIndex: z.coerce.number().int().optional(),
  }),
  params: z.object({
    chapterId: z.string().regex(/^\d+$/, 'Chapter ID must be a number'),
  }),
});

export const lessonSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255),
    titleAr: z.string().min(1).max(255),
    type: z.enum(['video', 'text', 'quiz', 'exam']).optional(),
    content: z.string().optional(),
    contentAr: z.string().optional(),
    videoUrl: z.string().max(500).optional(),
    duration: z.coerce.number().int().min(0).optional(),
    orderIndex: z.coerce.number().int().optional(),
    isFree: z.coerce.boolean().optional(),
  }),
  params: z.object({
    chapterId: z.string().regex(/^\d+$/, 'Chapter ID must be a number'),
  }),
});

export const updateLessonSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    titleAr: z.string().min(1).max(255).optional(),
    type: z.enum(['video', 'text', 'quiz', 'exam']).optional(),
    content: z.string().optional(),
    contentAr: z.string().optional(),
    videoUrl: z.string().max(500).optional(),
    duration: z.coerce.number().int().min(0).optional(),
    orderIndex: z.coerce.number().int().optional(),
    isFree: z.coerce.boolean().optional(),
  }),
  params: z.object({
    lessonId: z.string().regex(/^\d+$/, 'Lesson ID must be a number'),
  }),
});
