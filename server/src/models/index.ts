import sequelize from '../config/database';
import User from './User';
import Course from './Course';
import Chapter from './Chapter';
import Lesson from './Lesson';
import Enrollment from './Enrollment';
import LessonProgress from './LessonProgress';
import Exam from './Exam';
import ExamQuestion from './ExamQuestion';
import ExamAttempt from './ExamAttempt';
import Booking from './Booking';
import Payment from './Payment';
import BlogPost from './BlogPost';
import Certificate from './Certificate';
import Notification from './Notification';
import Page from './Page';
import SiteSetting from './SiteSetting';
import Announcement from './Announcement';
import PageContent from './PageContent';

// Course associations
Course.hasMany(Chapter, { foreignKey: 'courseId', as: 'chapters' });
Chapter.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Chapter.hasMany(Lesson, { foreignKey: 'chapterId', as: 'lessons' });
Lesson.belongsTo(Chapter, { foreignKey: 'chapterId', as: 'chapter' });

// Enrollment associations
User.hasMany(Enrollment, { foreignKey: 'userId', as: 'enrollments' });
Enrollment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Course.hasMany(Enrollment, { foreignKey: 'courseId', as: 'enrollments' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Lesson progress associations
User.hasMany(LessonProgress, { foreignKey: 'userId', as: 'lessonProgress' });
LessonProgress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Lesson.hasMany(LessonProgress, { foreignKey: 'lessonId', as: 'progress' });
LessonProgress.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' });

// Exam associations
Course.hasMany(Exam, { foreignKey: 'courseId', as: 'exams' });
Exam.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Exam.hasMany(ExamQuestion, { foreignKey: 'examId', as: 'questions' });
ExamQuestion.belongsTo(Exam, { foreignKey: 'examId', as: 'exam' });

User.hasMany(ExamAttempt, { foreignKey: 'userId', as: 'examAttempts' });
ExamAttempt.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Exam.hasMany(ExamAttempt, { foreignKey: 'examId', as: 'attempts' });
ExamAttempt.belongsTo(Exam, { foreignKey: 'examId', as: 'exam' });

// Booking associations
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Payment associations
User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Course.hasMany(Payment, { foreignKey: 'courseId', as: 'payments' });
Payment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Booking.hasMany(Payment, { foreignKey: 'bookingId', as: 'payments' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

// Blog associations
User.hasMany(BlogPost, { foreignKey: 'authorId', as: 'blogPosts' });
BlogPost.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

// Certificate associations
User.hasMany(Certificate, { foreignKey: 'userId', as: 'certificates' });
Certificate.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Course.hasMany(Certificate, { foreignKey: 'courseId', as: 'certificates' });
Certificate.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Notification associations
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export {
  sequelize,
  User,
  Course,
  Chapter,
  Lesson,
  Enrollment,
  LessonProgress,
  Exam,
  ExamQuestion,
  ExamAttempt,
  Booking,
  Payment,
  BlogPost,
  Certificate,
  Notification,
  Page,
  SiteSetting,
  Announcement,
  PageContent,
};
