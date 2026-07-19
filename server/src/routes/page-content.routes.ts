import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getPageContent, getAllPageContent, upsertPageContent, deletePageContent } from '../controllers/page-content.controller';

const router = Router();

router.get('/:page', getPageContent);
router.get('/', authenticate, authorize('admin'), getAllPageContent);
router.post('/', authenticate, authorize('admin'), upsertPageContent);
router.delete('/:id', authenticate, authorize('admin'), deletePageContent);

export default router;
