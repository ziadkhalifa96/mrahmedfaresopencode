import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';
import { User, Course, Enrollment, Payment, Booking, BlogPost, Certificate } from '../models';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsers,
      totalCourses,
      totalEnrollments,
      recentEnrollments,
      totalRevenue,
      recentRevenue,
      pendingPayments,
      totalBookings,
      pendingBookings,
      totalCertificates,
      totalBlogPosts,
    ] = await Promise.all([
      User.count({ where: { role: 'student' } }),
      User.count({ where: { role: 'student', createdAt: { [Op.gte]: thirtyDaysAgo } } }),
      Course.count(),
      Enrollment.count(),
      Enrollment.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } }),
      Payment.sum('amount', { where: { status: 'approved' } }) || 0,
      Payment.sum('amount', { where: { status: 'approved', createdAt: { [Op.gte]: thirtyDaysAgo } } }) || 0,
      Payment.count({ where: { status: 'pending' } }),
      Booking.count(),
      Booking.count({ where: { status: 'pending' } }),
      Certificate.count(),
      BlogPost.count(),
    ]);

    const recentEnrollmentsList = await Enrollment.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Course, as: 'course', attributes: ['id', 'title', 'titleAr', 'slug'] },
      ],
    });

    const recentPayments = await Payment.findAll({
      where: { status: 'pending' },
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json({
      stats: {
        totalUsers,
        newUsers,
        totalCourses,
        totalEnrollments,
        recentEnrollments,
        totalRevenue,
        recentRevenue,
        pendingPayments,
        totalBookings,
        pendingBookings,
        totalCertificates,
        totalBlogPosts,
      },
      recentEnrollments: recentEnrollmentsList,
      recentPayments,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get dashboard stats' });
  }
};
