import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Users, BookOpen, CreditCard, Calendar, Award, FileText } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { adminApi } from '../../services';

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.dashboard.getStats();
        setStats(response.data);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  const s = stats?.stats;

  const statCards = [
    { icon: Users, label: t('admin.totalUsers'), value: s?.totalUsers || 0, sub: `+${s?.newUsers || 0} ${isArabic ? 'هذا الشهر' : 'this month'}`, color: 'bg-blue-100 text-blue-600' },
    { icon: BookOpen, label: t('admin.totalCourses'), value: s?.totalCourses || 0, color: 'bg-green-100 text-green-600' },
    { icon: CreditCard, label: t('admin.totalRevenue'), value: `${s?.totalRevenue || 0} EGP`, sub: `+${s?.recentRevenue || 0} ${isArabic ? 'هذا الشهر' : 'this month'}`, color: 'bg-yellow-100 text-yellow-600' },
    { icon: Calendar, label: t('admin.totalBookings'), value: s?.totalBookings || 0, sub: `${s?.pendingBookings || 0} ${isArabic ? 'قيد الانتظار' : 'pending'}`, color: 'bg-purple-100 text-purple-600' },
  ];

  const pendingCards = [
    { icon: CreditCard, label: t('admin.pendingPayments'), value: s?.pendingPayments || 0, to: '/admin/payments', color: 'bg-orange-100 text-orange-600' },
    { icon: Users, label: t('admin.totalEnrollments'), value: s?.totalEnrollments || 0, sub: `+${s?.recentEnrollments || 0} ${isArabic ? 'هذا الشهر' : 'this month'}`, to: '/admin/courses', color: 'bg-indigo-100 text-indigo-600' },
    { icon: Award, label: t('admin.totalCertificates'), value: s?.totalCertificates || 0, to: '/admin/users', color: 'bg-pink-100 text-pink-600' },
    { icon: FileText, label: t('admin.totalBlogPosts'), value: s?.totalBlogPosts || 0, to: '/admin/blog', color: 'bg-teal-100 text-teal-600' },
  ];

  return (
    <>
      <SEO title={isArabic ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'} />
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('admin.dashboard')}</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
              <div className="card">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}><stat.icon className="w-6 h-6" /></div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
                {stat.sub && <div className="text-xs text-success mt-1">{stat.sub}</div>}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {pendingCards.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}>
              <Link to={stat.to} className="card hover:shadow-md transition-shadow block">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
                {stat.sub && <div className="text-xs text-gray-500 mt-0.5">{stat.sub}</div>}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {isArabic ? 'آخر التسجيلات' : 'Recent Enrollments'}
            </h2>
            {stats?.recentEnrollments?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentEnrollments.map((e: any) => (
                  <div key={e.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{e.user?.name}</div>
                      <div className="text-xs text-gray-500">{isArabic ? e.course?.titleAr : e.course?.title}</div>
                    </div>
                    <div className="text-xs text-gray-500">{new Date(e.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">{t('common.noData')}</p>
            )}
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {isArabic ? 'مدفوعات قيد المراجعة' : 'Pending Payments'}
            </h2>
            {stats?.recentPayments?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentPayments.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{p.user?.name}</div>
                      <div className="text-xs text-gray-500">{p.amount} EGP - {p.senderPhone}</div>
                    </div>
                    <Link to="/admin/payments" className="text-xs text-primary hover:underline">{isArabic ? 'مراجعة' : 'Review'}</Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">{t('common.noData')}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
