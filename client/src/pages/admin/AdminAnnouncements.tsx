import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Megaphone, Plus, Trash2, Edit, Loader2 } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { adminApi } from '../../services';

export default function AdminAnnouncements() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await adminApi.announcements.getAll();
      setAnnouncements(response.data.announcements);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      message: formData.get('message') as string,
      messageAr: formData.get('messageAr') as string,
      isActive: formData.get('isActive') === 'on',
      link: formData.get('link') as string || undefined,
    };
    try {
      if (editing) {
        await adminApi.announcements.update(editing.id, data);
      } else {
        await adminApi.announcements.create(data);
      }
      setShowForm(false);
      setEditing(null);
      fetchAnnouncements();
    } catch {}
  };

  const handleDelete = async (id: number) => {
    if (!confirm(isArabic ? 'هل تريد حذف هذا الإعلان؟' : 'Delete this announcement?')) return;
    try { await adminApi.announcements.delete(id); fetchAnnouncements(); } catch {}
  };

  const handleToggle = async (id: number, isActive: boolean) => {
    try { await adminApi.announcements.update(id, { isActive: !isActive }); fetchAnnouncements(); } catch {}
  };

  return (
    <>
      <SEO title={isArabic ? 'الإعلانات' : 'Announcements'} />
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.announcements')}</h1>
          <button onClick={() => { setShowForm(!showForm); setEditing(null); }} className="btn-primary"><Plus className="w-4 h-4" /> {isArabic ? 'إضافة إعلان' : 'New Announcement'}</button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="card mb-6">
            <h2 className="text-lg font-semibold mb-4">{editing ? (isArabic ? 'تعديل الإعلان' : 'Edit') : (isArabic ? 'إعلان جديد' : 'New')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Message</label><input type="text" name="message" defaultValue={editing?.message} className="input" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">الرسالة بالعربي</label><input type="text" name="messageAr" defaultValue={editing?.messageAr} className="input" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'رابط (اختياري)' : 'Link (optional)'}</label><input type="url" name="link" defaultValue={editing?.link} className="input" /></div>
              <div className="flex items-center gap-2"><input type="checkbox" name="isActive" defaultChecked={editing?.isActive ?? true} className="w-4 h-4" /><label className="text-sm">{isArabic ? 'نشط' : 'Active'}</label></div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary">{editing ? t('common.save') : (isArabic ? 'إنشاء' : 'Create')}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="btn-outline">{t('common.cancel')}</button>
              </div>
            </form>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-20"><Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">{t('common.noData')}</p></div>
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{a.message}</div>
                    <div className="text-sm text-gray-500">{a.messageAr}</div>
                    {a.link && <div className="text-xs text-primary mt-1">{a.link}</div>}
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleToggle(a.id, a.isActive)} className={`w-10 h-6 rounded-full relative transition-colors ${a.isActive ? 'bg-primary' : 'bg-gray-300'}`}>
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${a.isActive ? 'left-5' : 'left-1'}`} />
                    </button>
                    <button onClick={() => { setEditing(a); setShowForm(true); }} className="p-1 text-gray-400 hover:text-primary"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(a.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
