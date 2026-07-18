import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { BookOpen, CreditCard, Calendar, Award, Bell, ArrowRight } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { useAuth } from '../../contexts/AuthContext';
import { enrollmentsApi, paymentsApi, bookingsApi, notificationsApi } from '../../services';

export default function StudentDashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isArabic = i18n.language === 'ar';
  const [stats, setStats] = useState({ courses: 0, payments: 0, bookings: 0, certificates: 0, unreadNotifications: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [enrollRes, paymentsRes, bookingsRes, notifRes] = await Promise.allSettled([
          enrollmentsApi.getMyEnrollments(),
          paymentsApi.getMyPayments(),
          bookingsApi.getMyBookings(),
          notificationsApi.getAll(),
        ]);

        setStats({
          courses: enrollRes.status === 'fulfilled' ? (enrollRes.value.data.enrollments?.length || 0) : 0,
          payments: paymentsRes.status === 'fulfilled' ? (paymentsRes.value.data.payments?.length || 0) : 0,
          bookings: bookingsRes.status === 'fulfilled' ? (bookingsRes.value.data.bookings?.length || 0) : 0,
          certificates: 0,
          unreadNotifications: notifRes.status === 'fulfilled' ? (notifRes.value.data.unreadCount || 0) : 0,
        });
      } catch {}
    };
    fetchStats();
  }, []);

  const statCards = [
    { icon: BookOpen, label: t('dashboard.myCourses'), value: stats.courses, color: 'bg-blue-100 text-blue-600', to: '/dashboard/courses' },
    { icon: CreditCard, label: t('dashboard.myPayments'), value: stats.payments, color: 'bg-green-100 text-green-600', to: '/dashboard/payments' },
    { icon: Calendar, label: t('dashboard.myBookings'), value: stats.bookings, color: 'bg-purple-100 text-purple-600', to: '/dashboard/bookings' },
    { icon: Award, label: t('dashboard.myCertificates'), value: stats.certificates, color: 'bg-yellow-100 text-yellow-600', to: '/dashboard/certificates' },
  ];

  const quickActions = [
    { to: '/courses', icon: BookOpen, label: isArabic ? 'تصفح الكورسات' : 'Browse Courses', color: 'bg-primary text-white' },
    { to: '/dashboard/profile', icon: User, label: t('dashboard.profile'), color: 'bg-gray-100 text-gray-700' },
        { to: '/dashboard/notifications', icon: Bell, label: t('dashboard.notifications'), color: 'bg-gray-100 text-gray-700', badge: stats.unreadNotifications > 0 ? stats.unreadNotifications : undefined },
  ];

  return (
    <>
      <SEO title={isArabic ? 'لوحة التحكم' : 'Dashboard'} />

      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('dashboard.welcome')}, {user?.name}!
        </h1>
        <p className="text-gray-600 mb-8">
          {isArabic ? 'تابع تقدمك وإدارة حسابك' : 'Track your progress and manage your account'}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link to={stat.to} className="card hover:shadow-md transition-shadow block">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {isArabic ? 'إجراءات سريعة' : 'Quick Actions'}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            >
              <Link
                to={action.to}
                className="card hover:shadow-md transition-shadow flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="font-medium text-gray-900 flex-1">{action.label}</span>
                {action.badge && (
                  <span className="bg-danger text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {action.badge}
                  </span>
                )}
                <ArrowRight className={`w-4 h-4 text-gray-400 ${isArabic ? 'rotate-180' : ''}`} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

function User({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
