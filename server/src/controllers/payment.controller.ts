import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Payment, Course, Booking } from '../models';
import { upload } from '../utils/upload';

export const getMyPayments = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const payments = await Payment.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Course, as: 'course', attributes: ['id', 'title', 'titleAr', 'slug', 'thumbnail'] },
        { model: Booking, as: 'booking', attributes: ['id', 'date', 'time', 'type'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ payments });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get payments' });
  }
};

export const submitPayment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const { amount, method, senderPhone, courseId, bookingId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Payment proof image is required' });
    }

    const proofImage = `/uploads/payments/${req.file.filename}`;

    const payment = await Payment.create({
      userId: req.user.id,
      courseId: courseId || null,
      bookingId: bookingId || null,
      amount,
      method,
      proofImage,
      senderPhone,
      status: 'pending',
    });

    res.status(201).json({ message: 'Payment submitted successfully', payment });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to submit payment' });
  }
};
