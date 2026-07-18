import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Users, BookOpen, CreditCard, Calendar, FileText, Settings, Megaphone, Award, Bell, ArrowLeft } from 'lucide-react';

export default function AdminSidebar() {
  const { t } = useTranslation();

  const links = [
    { to: '/admin', icon: LayoutDashboard, label: t('admin.dashboard'), end: true },
    { to: '/admin/users', icon: Users, label: t('admin.users') },
    { to: '/admin/courses', icon: BookOpen, label: t('admin.courses') },
    { to: '/admin/payments', icon: CreditCard, label: t('admin.payments') },
    { to: '/admin/bookings', icon: Calendar, label: t('admin.bookings') },
    { to: '/admin/blog', icon: FileText, label: t('admin.blog') },
    { to: '/admin/exams', icon: Award, label: t('admin.exams') },
    { to: '/admin/notifications', icon: Bell, label: t('admin.sendNotifications') },
    { to: '/admin/announcements', icon: Megaphone, label: t('admin.announcements') },
    { to: '/admin/settings', icon: Settings, label: t('admin.settings') },
  ];

  return (
    <nav className="space-y-1">
      <NavLink to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 mb-4">
        <ArrowLeft className="w-5 h-5" />
        <span>{t('admin.backToStudent')}</span>
      </NavLink>
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
