import { Router } from 'express';
import authRoutes from './auth.routes';
import courseRoutes from './course.routes';
import blogRoutes from './blog.routes';
import examRoutes from './exam.routes';
import enrollmentRoutes from './enrollment.routes';
import paymentRoutes from './payment.routes';
import bookingRoutes from './booking.routes';
import certificateRoutes from './certificate.routes';
import notificationRoutes from './notification.routes';
import progressRoutes from './progress.routes';
import adminRoutes from './admin.routes';
import adminExamRoutes from './admin-exams.routes';
import adminNotificationRoutes from './admin-notifications.routes';
import publicRoutes from './public.routes';
import pageContentRoutes from './page-content.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/blog', blogRoutes);
router.use('/exams', examRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/payments', paymentRoutes);
router.use('/bookings', bookingRoutes);
router.use('/certificates', certificateRoutes);
router.use('/notifications', notificationRoutes);
router.use('/progress', progressRoutes);
router.use('/admin', adminRoutes);
router.use('/admin/exams', adminExamRoutes);
router.use('/admin/notifications', adminNotificationRoutes);
router.use('/page-content', pageContentRoutes);
router.use('/public', publicRoutes);

export default router;
