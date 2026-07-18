import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';
import { BlogPost, User } from '../models';
import { generateSlug } from '../utils/helpers';

export const getBlogPosts = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '20', search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { titleAr: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows, count } = await BlogPost.findAndCountAll({
      where,
      include: [{ model: User, as: 'author', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
      limit: limitNum,
      offset,
    });

    res.json({ posts: rows, total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get blog posts' });
  }
};

export const createBlogPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, titleAr, content, contentAr, excerpt, excerptAr, isPublished } = req.body;
    const slug = generateSlug(title);

    const existing = await BlogPost.findOne({ where: { slug } });
    if (existing) return res.status(409).json({ error: 'Post with this slug already exists' });

    const thumbnail = req.file ? `/uploads/blog/${req.file.filename}` : undefined;

    const post = await BlogPost.create({
      title, titleAr, slug, content, contentAr,
      excerpt, excerptAr, thumbnail,
      isPublished: isPublished === 'true' || isPublished === true,
      authorId: req.user!.id,
    });

    res.status(201).json({ post });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create blog post' });
  }
};

export const updateBlogPost = async (req: AuthRequest, res: Response) => {
  try {
    const post = await BlogPost.findByPk(req.params.id as string);
    if (!post) return res.status(404).json({ error: 'Blog post not found' });

    const { title, titleAr, content, contentAr, excerpt, excerptAr, isPublished } = req.body;
    const updates: any = {};
    if (title !== undefined) { updates.title = title; updates.slug = generateSlug(title); }
    if (titleAr !== undefined) updates.titleAr = titleAr;
    if (content !== undefined) updates.content = content;
    if (contentAr !== undefined) updates.contentAr = contentAr;
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (excerptAr !== undefined) updates.excerptAr = excerptAr;
    if (isPublished !== undefined) updates.isPublished = isPublished === 'true' || isPublished === true;
    if (req.file) updates.thumbnail = `/uploads/blog/${req.file.filename}`;

    await post.update(updates);
    res.json({ post });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update blog post' });
  }
};

export const deleteBlogPost = async (req: AuthRequest, res: Response) => {
  try {
    const post = await BlogPost.findByPk(req.params.id as string);
    if (!post) return res.status(404).json({ error: 'Blog post not found' });

    await post.destroy();
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete blog post' });
  }
};
