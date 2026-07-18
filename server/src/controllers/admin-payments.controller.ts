import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';
import { Payment, User, Course } from '../models';

export const getPayments = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '20', status, search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status) where.status = status;

    if (search) {
      where[Op.or] = [
        { senderPhone: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows, count } = await Payment.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
        { model: Course, as: 'course', attributes: ['id', 'title', 'titleAr'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: limitNum,
      offset,
    });

    res.json({ payments: rows, total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get payments' });
  }
};

export const reviewPayment = async (req: AuthRequest, res: Response) => {
  try {
    const payment = await Payment.findByPk(req.params.id as string);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    const { status, adminNotes } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be approved or rejected' });
    }

    await payment.update({
      status,
      adminNotes,
      reviewedAt: new Date(),
      reviewedBy: req.user!.id,
    });

    res.json({ payment });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to review payment' });
  }
};
