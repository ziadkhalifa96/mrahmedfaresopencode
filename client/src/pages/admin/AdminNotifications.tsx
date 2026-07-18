import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Bell, Send, Trash2, Loader2, Search } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { adminApi } from '../../services';
import type { Notification, User } from '../../types';

export default function AdminNotifications() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(true);
  const [form, setForm] = useState({
    title: '', titleAr: '', message: '', messageAr: '',
    type: 'system' as 'system' | 'payment' | 'course' | 'booking',
    link: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [notiRes, usersRes] = await Promise.all([
        adminApi.notifications.getAll(),
        adminApi.users.getAll({ limit: 100 }),
      ]);
      setNotifications(notiRes.data.notifications || []);
      setUsers(usersRes.data.users || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleSend = async () => {
    if (!form.title || !form.message) return;
    setSending(true);
    try {
      await adminApi.notifications.send({
        ...form,
        userIds: selectAll ? [] : selectedUsers,
      });
      setShowForm(false);
      setForm({ title: '', titleAr: '', message: '', messageAr: '', type: 'system', link: '' });
      setSelectedUsers([]);
      setSelectAll(true);
      fetchData();
    } catch {} finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminApi.notifications.delete(id);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch {}
  };

  const toggleUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const typeLabels: Record<string, string> = {
    system: isArabic ? 'نظامي' : 'System',
    payment: isArabic ? 'دفع' : 'Payment',
    course: isArabic ? 'كورس' : 'Course',
    booking: isArabic ? 'حجز' : 'Booking',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SEO title={isArabic ? 'إرسال إشعارات' : 'Send Notifications'} />
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{isArabic ? 'إرسال إشعارات' : 'Send Notifications'}</h1>
            <p className="text-sm text-gray-500 mt-1">{isArabic ? 'أرسل إشعارات للطلاب' : 'Send notifications to students'}</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
            <Send className="w-4 h-4" />
            {isArabic ? 'إرسال إشعار' : 'Send Notification'}
          </button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-8"
          >
            <h3 className="font-semibold text-gray-900 mb-4">{isArabic ? 'إشعار جديد' : 'New Notification'}</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'العنوان (إنجليزي)' : 'Title (EN)'}</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input w-full" placeholder="Title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'العنوان (عربي)' : 'Title (AR)'}</label>
                <input type="text" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                  className="input w-full" placeholder="العنوان" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'الرسالة (إنجليزي)' : 'Message (EN)'}</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input w-full" rows={3} placeholder="Message" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'الرسالة (عربي)' : 'Message (AR)'}</label>
                <textarea value={form.messageAr} onChange={(e) => setForm({ ...form, messageAr: e.target.value })}
                  className="input w-full" rows={3} placeholder="الرسالة" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'النوع' : 'Type'}</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  className="input w-full">
                  <option value="system">{typeLabels.system}</option>
                  <option value="payment">{typeLabels.payment}</option>
                  <option value="course">{typeLabels.course}</option>
                  <option value="booking">{typeLabels.booking}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'رابط (اختياري)' : 'Link (optional)'}</label>
                <input type="text" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="input w-full" placeholder="/dashboard/courses" />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  {isArabic ? 'المستلمون' : 'Recipients'}
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={selectAll} onChange={(e) => setSelectAll(e.target.checked)}
                    className="w-4 h-4 text-primary rounded" />
                  {isArabic ? 'جميع الطلاب' : 'All Students'}
                </label>
              </div>
              {!selectAll && (
                <div>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
                      className="input w-full pl-10" placeholder={isArabic ? 'بحث عن طالب...' : 'Search students...'} />
                  </div>
                  <div className="max-h-40 overflow-y-auto border rounded-lg p-2 space-y-1">
                    {filteredUsers.filter((u) => u.role === 'student').map((user) => (
                      <label key={user.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUser(user.id)} className="w-4 h-4 text-primary rounded" />
                        <span className="text-sm">{user.name}</span>
                        <span className="text-xs text-gray-400">{user.email}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={handleSend} disabled={sending || !form.title || !form.message}
                className="btn-primary flex items-center gap-2">
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {isArabic ? 'إرسال' : 'Send'}
              </button>
              <button onClick={() => setShowForm(false)} className="btn-outline">
                {t('common.cancel')}
              </button>
            </div>
          </motion.div>
        )}

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">{isArabic ? 'الإشعارات المرسلة' : 'Sent Notifications'}</h3>
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{isArabic ? 'لا توجد إشعارات بعد' : 'No notifications yet'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((noti) => (
                <div key={noti.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm">{isArabic ? noti.titleAr : noti.title}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{isArabic ? noti.messageAr : noti.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">{typeLabels[noti.type]}</span>
                        <span className="text-xs text-gray-400">{new Date(noti.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(noti.id)} className="text-gray-400 hover:text-red-500 flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
