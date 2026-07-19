import { Router } from 'express';
import { getPublicHeroSlides, getAllHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide } from '../controllers/hero-slides.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getPublicHeroSlides);
router.get('/admin', authenticate, authorize('admin'), getAllHeroSlides);
router.post('/admin', authenticate, authorize('admin'), createHeroSlide);
router.put('/admin/:id', authenticate, authorize('admin'), updateHeroSlide);
router.delete('/admin/:id', authenticate, authorize('admin'), deleteHeroSlide);

export default router;
