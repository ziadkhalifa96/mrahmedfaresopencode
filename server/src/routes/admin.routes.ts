import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getDashboardStats } from '../controllers/admin.controller';
import { getUsers, getUser, updateUser, deleteUser } from '../controllers/admin-users.controller';
import { getCourses, getCourse, createCourse, updateCourse, deleteCourse, createChapter, updateChapter, deleteChapter, createLesson, updateLesson, deleteLesson } from '../controllers/admin-courses.controller';
import { getPayments, reviewPayment } from '../controllers/admin-payments.controller';
import { getBookings, updateBooking, createBooking, deleteBooking } from '../controllers/admin-bookings.controller';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '../controllers/admin-blog.controller';
import { getSettings, updateSetting, getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../controllers/admin-settings.controller';
import { upload } from '../utils/upload';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/courses', getCourses);
router.get('/courses/:id', getCourse);
router.post('/courses', upload.single('thumbnail'), createCourse);
router.put('/courses/:id', upload.single('thumbnail'), updateCourse);
router.delete('/courses/:id', deleteCourse);

router.post('/courses/:courseId/chapters', createChapter);
router.put('/chapters/:chapterId', updateChapter);
router.delete('/chapters/:chapterId', deleteChapter);

router.post('/chapters/:chapterId/lessons', createLesson);
router.put('/lessons/:lessonId', updateLesson);
router.delete('/lessons/:lessonId', deleteLesson);

router.get('/payments', getPayments);
router.put('/payments/:id/review', reviewPayment);

router.get('/bookings', getBookings);
router.post('/bookings', createBooking);
router.put('/bookings/:id', updateBooking);
router.delete('/bookings/:id', deleteBooking);

router.get('/blog', getBlogPosts);
router.post('/blog', upload.single('thumbnail'), createBlogPost);
router.put('/blog/:id', upload.single('thumbnail'), updateBlogPost);
router.delete('/blog/:id', deleteBlogPost);

router.get('/settings', getSettings);
router.put('/settings/:key', updateSetting);

router.get('/announcements', getAnnouncements);
router.post('/announcements', createAnnouncement);
router.put('/announcements/:id', updateAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);

export default router;
