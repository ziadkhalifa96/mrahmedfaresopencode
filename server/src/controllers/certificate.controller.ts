import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Certificate, Course, User } from '../models';

export const getMyCertificates = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const certificates = await Certificate.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Course, as: 'course', attributes: ['id', 'title', 'titleAr', 'slug', 'thumbnail'] },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
      order: [['issuedAt', 'DESC']],
    });

    res.json({ certificates });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get certificates' });
  }
};
