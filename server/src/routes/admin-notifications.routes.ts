import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { sendNotification, getAllNotifications, deleteNotification } from '../controllers/admin-notifications.controller';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/', getAllNotifications);
router.post('/', sendNotification);
router.delete('/:id', deleteNotification);

export default router;
