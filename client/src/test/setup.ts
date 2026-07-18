import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver for framer-motion
class MockIntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds: number[] = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

window.scrollTo = () => {};

// Mock react-i18next
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => {
        const translations: Record<string, string> = {
          'nav.home': 'Home',
          'nav.courses': 'Courses',
          'nav.blog': 'Blog',
          'nav.about': 'About',
          'nav.contact': 'Contact',
          'nav.login': 'Login',
          'nav.register': 'Register',
          'nav.dashboard': 'Dashboard',
          'nav.admin': 'Admin',
          'nav.logout': 'Logout',
          'hero.title': 'Learn English with 28 Years of Experience',
          'hero.subtitle': 'Ahmed Fares - Diploma in Teaching English from Scotland',
          'hero.cta': 'Start Learning Now',
          'hero.secondary': 'View Courses',
          'features.title': 'Why Choose Us',
          'features.subtitle': 'We provide the best English learning experience',
          'features.courses.title': 'Comprehensive Courses',
          'features.courses.description': 'Well-structured courses covering all aspects of English for Thanaweya Amma',
          'features.live.title': 'Live Sessions',
          'features.live.description': 'Interactive online and offline sessions with expert guidance',
          'features.exams.title': 'Online Exams',
          'features.exams.description': 'Practice exams with instant grading and detailed feedback',
          'features.ai.title': 'AI-Powered Learning',
          'features.ai.description': 'Smart tools to enhance your learning experience',
          'auth.login.title': 'Welcome Back',
          'auth.login.subtitle': 'Sign in to your account',
          'auth.login.email': 'Email',
          'auth.login.password': 'Password',
          'auth.login.submit': 'Sign In',
          'auth.login.noAccount': "Don't have an account?",
          'auth.login.register': 'Register',
          'auth.register.title': 'Create Account',
          'auth.register.subtitle': 'Join Ahmed Fares English Academy',
          'auth.register.name': 'Full Name',
          'auth.register.email': 'Email',
          'auth.register.password': 'Password',
          'auth.register.phone': 'Phone (optional)',
          'auth.register.submit': 'Create Account',
          'auth.register.hasAccount': 'Already have an account?',
          'auth.register.login': 'Sign In',
          'dashboard.welcome': 'Welcome',
          'dashboard.myCourses': 'My Courses',
          'dashboard.myPayments': 'My Payments',
          'dashboard.myBookings': 'My Bookings',
          'dashboard.myCertificates': 'My Certificates',
          'dashboard.profile': 'Profile Settings',
          'dashboard.notifications': 'Notifications',
          'common.loading': 'Loading...',
          'common.error': 'Something went wrong',
          'common.save': 'Save',
          'common.cancel': 'Cancel',
          'common.delete': 'Delete',
          'common.edit': 'Edit',
          'common.view': 'View',
          'common.search': 'Search...',
          'common.noData': 'No data found',
          'common.confirm': 'Are you sure?',
          'common.back': 'Back',
          'common.next': 'Next',
          'common.submit': 'Submit',
          'admin.dashboard': 'Admin Dashboard',
          'admin.users': 'Users',
          'admin.courses': 'Courses',
          'admin.payments': 'Payments',
          'admin.bookings': 'Bookings',
          'admin.blog': 'Blog',
          'admin.announcements': 'Announcements',
          'admin.exams': 'Exams',
          'admin.sendNotifications': 'Notifications',
          'admin.settings': 'Settings',
          'admin.backToStudent': 'Back to Dashboard',
          'admin.totalUsers': 'Total Users',
          'admin.totalCourses': 'Total Courses',
          'admin.totalRevenue': 'Total Revenue',
          'admin.totalBookings': 'Total Bookings',
          'admin.pendingPayments': 'Pending Payments',
          'admin.totalEnrollments': 'Total Enrollments',
          'admin.totalCertificates': 'Total Certificates',
          'admin.totalBlogPosts': 'Blog Posts',
          'footer.description': 'Premium English learning platform for Egyptian Thanaweya Amma students',
          'footer.quickLinks': 'Quick Links',
          'footer.contact': 'Contact Us',
          'footer.followUs': 'Follow Us',
          'footer.rights': 'All rights reserved',
        };
        return translations[key] || key;
      },
      i18n: { language: 'en', changeLanguage: vi.fn() },
    }),
    Trans: ({ children }: any) => children,
  };
});
