import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ui/ErrorBoundary';
import PageLoader from './components/ui/PageLoader';
import RootLayout from './components/layout/RootLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLayout from './components/layout/AdminLayout';
import './i18n';

const Home = lazy(() => import('./pages/public/Home'));
const Courses = lazy(() => import('./pages/public/Courses'));
const Blog = lazy(() => import('./pages/public/Blog'));
const BlogPostDetail = lazy(() => import('./pages/public/BlogPostDetail'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));
const NotFound = lazy(() => import('./pages/public/NotFound'));
const CourseDetail = lazy(() => import('./pages/public/CourseDetail'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'));
const MyCourses = lazy(() => import('./pages/student/MyCourses'));
const MyPayments = lazy(() => import('./pages/student/MyPayments'));
const MyBookings = lazy(() => import('./pages/student/MyBookings'));
const MyCertificates = lazy(() => import('./pages/student/MyCertificates'));
const CertificateView = lazy(() => import('./pages/student/CertificateView'));
const Notifications = lazy(() => import('./pages/student/Notifications'));
const Profile = lazy(() => import('./pages/student/Profile'));
const ChangePassword = lazy(() => import('./pages/student/ChangePassword'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminCourses = lazy(() => import('./pages/admin/AdminCourses'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminAnnouncements = lazy(() => import('./pages/admin/AdminAnnouncements'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminExams = lazy(() => import('./pages/admin/AdminExams'));
const AdminNotifications = lazy(() => import('./pages/admin/AdminNotifications'));
const LessonViewer = lazy(() => import('./pages/public/LessonViewer'));
const TakeExam = lazy(() => import('./pages/public/TakeExam'));

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <ThemeProvider>
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Language redirect - redirect root to default language */}
                  <Route path="/" element={<Navigate to="/en" replace />} />

                  {/* Public Routes with language prefix */}
                  <Route element={<RootLayout />}>
                    <Route path="/:lang" element={<Home />} />
                    <Route path="/:lang/courses" element={<Courses />} />
                    <Route path="/:lang/courses/:slug" element={<CourseDetail />} />
                    <Route path="/:lang/blog" element={<Blog />} />
                    <Route path="/:lang/blog/:slug" element={<BlogPostDetail />} />
                    <Route path="/:lang/about" element={<About />} />
                    <Route path="/:lang/contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>

                  {/* Auth Routes (no language prefix needed) */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Lesson & Exam Routes (full-screen) */}
                  <Route path="/lessons/:lessonId" element={<LessonViewer />} />
                  <Route path="/exams/:examId" element={<TakeExam />} />

                  {/* Student Dashboard Routes */}
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<StudentDashboard />} />
                    <Route path="/dashboard/courses" element={<MyCourses />} />
                    <Route path="/dashboard/payments" element={<MyPayments />} />
                    <Route path="/dashboard/bookings" element={<MyBookings />} />
                    <Route path="/dashboard/certificates" element={<MyCertificates />} />
                    <Route path="/dashboard/certificates/:id" element={<CertificateView />} />
                    <Route path="/dashboard/notifications" element={<Notifications />} />
                    <Route path="/dashboard/profile" element={<Profile />} />
                    <Route path="/dashboard/password" element={<ChangePassword />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/courses" element={<AdminCourses />} />
                    <Route path="/admin/payments" element={<AdminPayments />} />
                    <Route path="/admin/bookings" element={<AdminBookings />} />
                    <Route path="/admin/blog" element={<AdminBlog />} />
                    <Route path="/admin/exams" element={<AdminExams />} />
                    <Route path="/admin/notifications" element={<AdminNotifications />} />
                    <Route path="/admin/announcements" element={<AdminAnnouncements />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ThemeProvider>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}