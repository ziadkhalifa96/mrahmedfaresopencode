import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getMyNotifications, markAsRead, markAllAsRead } from '../controllers/notification.controller';

const router = Router();

router.get('/', authenticate, getMyNotifications);
router.put('/read-all', authenticate, markAllAsRead);
router.put('/:id/read', authenticate, markAsRead);

export default router;
