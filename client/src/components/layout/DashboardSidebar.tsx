import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { BookOpen, CreditCard, Calendar, Award, User, Bell, LayoutDashboard } from 'lucide-react';

export default function DashboardSidebar() {
  const { t } = useTranslation();

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard'), end: true },
    { to: '/dashboard/courses', icon: BookOpen, label: t('dashboard.myCourses') },
    { to: '/dashboard/payments', icon: CreditCard, label: t('dashboard.myPayments') },
    { to: '/dashboard/bookings', icon: Calendar, label: t('dashboard.myBookings') },
    { to: '/dashboard/certificates', icon: Award, label: t('dashboard.myCertificates') },
    { to: '/dashboard/notifications', icon: Bell, label: t('dashboard.notifications') },
    { to: '/dashboard/profile', icon: User, label: t('dashboard.profile') },
  ];

  return (
    <nav className="space-y-1">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          <link.icon className="w-5 h-5" />
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
