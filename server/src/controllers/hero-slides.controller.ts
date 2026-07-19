import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import HeroSlide from '../models/HeroSlide';

export const getPublicHeroSlides = async (req: AuthRequest, res: Response) => {
  try {
    const slides = await HeroSlide.findAll({
      where: { isActive: true },
      order: [['orderIndex', 'ASC']],
      attributes: ['id', 'titleEn', 'titleAr', 'subtitleEn', 'subtitleAr', 'ctaTextEn', 'ctaTextAr', 'ctaLink', 'bgGradient', 'imageUrl', 'orderIndex'],
    });
    res.json({ slides });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get hero slides' });
  }
};

export const getAllHeroSlides = async (req: AuthRequest, res: Response) => {
  try {
    const slides = await HeroSlide.findAll({
      order: [['orderIndex', 'ASC']],
    });
    res.json({ slides });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get hero slides' });
  }
};

export const createHeroSlide = async (req: AuthRequest, res: Response) => {
  try {
    const { titleEn, titleAr, subtitleEn, subtitleAr, ctaTextEn, ctaTextAr, ctaLink, bgGradient, imageUrl, orderIndex, isActive } = req.body;
    const slide = await HeroSlide.create({
      titleEn, titleAr, subtitleEn, subtitleAr, ctaTextEn, ctaTextAr,
      ctaLink: ctaLink || '/courses',
      bgGradient: bgGradient || 'from-primary via-primary-dark to-blue-900',
      imageUrl, orderIndex: orderIndex || 0, isActive: isActive !== false,
    } as any);
    res.status(201).json({ slide });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create hero slide' });
  }
};

export const updateHeroSlide = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const slide = await HeroSlide.findByPk(id);
    if (!slide) return res.status(404).json({ error: 'Hero slide not found' });
    await slide.update(req.body);
    res.json({ slide });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update hero slide' });
  }
};

export const deleteHeroSlide = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const slide = await HeroSlide.findByPk(id);
    if (!slide) return res.status(404).json({ error: 'Hero slide not found' });
    await slide.destroy();
    res.json({ message: 'Hero slide deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete hero slide' });
  }
};
