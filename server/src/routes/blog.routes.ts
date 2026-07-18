import { Router } from 'express';
import { getPublishedPosts, getPostBySlug } from '../controllers/blog.controller';

const router = Router();

router.get('/', getPublishedPosts);
router.get('/:slug', getPostBySlug);

export default router;
