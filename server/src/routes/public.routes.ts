import { Router } from 'express';
import { getPublicAnnouncements, getPublicSettings, getSiteSettings } from '../controllers/public.controller';

const router = Router();

router.get('/announcements', getPublicAnnouncements);
router.get('/settings', getPublicSettings);
router.get('/site-settings', getSiteSettings);

export default router;
