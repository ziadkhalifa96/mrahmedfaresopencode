import { Router } from 'express';
import { getPublicAnnouncements, getPublicSettings } from '../controllers/public.controller';

const router = Router();

router.get('/announcements', getPublicAnnouncements);
router.get('/settings', getPublicSettings);

export default router;
