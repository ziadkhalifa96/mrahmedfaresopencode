import { z } from 'zod';

export const courseSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255),
    titleAr: z.string().min(1).max(255),
    description: z.string().min(1),
    descriptionAr: z.string().min(1),
    slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
    thumbnail: z.string().max(500).optional(),
    price: z.number().min(0).optional(),
    isFree: z.boolean().optional(),
    isPublished: z.boolean().optional(),
    orderIndex: z.number().int().optional(),
  }),
});

export const chapterSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255),
    titleAr: z.string().min(1).max(255),
    orderIndex: z.number().int().optional(),
  }),
  params: z.object({
    courseId: z.string().regex(/^\d+$/, 'Course ID must be a number'),
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
    duration: z.number().int().min(0).optional(),
    orderIndex: z.number().int().optional(),
    isFree: z.boolean().optional(),
  }),
  params: z.object({
    chapterId: z.string().regex(/^\d+$/, 'Chapter ID must be a number'),
  }),
});
