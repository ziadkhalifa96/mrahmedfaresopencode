import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { notificationsApi } from '../../services';
import type { Notification } from '../../types';

export default function Notifications() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationsApi.getAll();
        setNotifications(response.data.notifications || []);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch {}
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <SEO title={isArabic ? 'الإشعارات' : 'Notifications'} />
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.notifications')}</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {unreadCount} {isArabic ? 'إشعار غير مقروء' : 'unread notifications'}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllAsRead} className="btn-outline text-sm">
              {isArabic ? 'تحديد الكل كمقروء' : 'Mark All Read'}
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <BellOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isArabic ? 'لا توجد إشعارات' : 'No Notifications'}
            </h3>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`card cursor-pointer transition-all hover:shadow-md ${
                  !notif.isRead ? 'border-l-4 border-primary bg-primary/5' : ''
                }`}
                onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    notif.type === 'course' ? 'bg-blue-100 text-blue-600'
                    : notif.type === 'payment' ? 'bg-green-100 text-green-600'
                    : notif.type === 'booking' ? 'bg-purple-100 text-purple-600'
                    : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{isArabic ? notif.titleAr : notif.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{isArabic ? notif.messageAr : notif.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
