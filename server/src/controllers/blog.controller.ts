import { Response } from 'express';
import { Op } from 'sequelize';
import { BlogPost, User } from '../models';

export const getPublishedPosts = async (req: any, res: Response) => {
  try {
    const { page = '1', limit = '12', search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const where: any = { isPublished: true };
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

    res.json({ data: rows, total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get blog posts' });
  }
};

export const getPostBySlug = async (req: any, res: Response) => {
  try {
    const { slug } = req.params;
    const post = await BlogPost.findOne({
      where: { slug, isPublished: true },
      include: [{ model: User, as: 'author', attributes: ['id', 'name'] }],
    });

    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ post });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get blog post' });
  }
};
