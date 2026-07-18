import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Calendar, Plus, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { adminApi } from '../../services';

export default function AdminBookings() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      const response = await adminApi.bookings.getAll(params);
      setBookings(response.data.bookings);
      setTotalPages(response.data.totalPages);
    } catch {} finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await adminApi.bookings.create({
        type: formData.get('type'),
        date: formData.get('date'),
        time: formData.get('time'),
        duration: parseInt(formData.get('duration') as string) || 60,
        maxSeats: parseInt(formData.get('maxSeats') as string) || 1,
        dailyRoomUrl: formData.get('dailyRoomUrl'),
        location: formData.get('location'),
        notes: formData.get('notes'),
      });
      setShowForm(false);
      fetchBookings();
    } catch {}
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try { await adminApi.bookings.update(id, { status }); fetchBookings(); } catch {}
  };

  const handleDelete = async (id: number) => {
    if (!confirm(isArabic ? 'هل تريد حذف هذا الحجز؟' : 'Delete this booking?')) return;
    try { await adminApi.bookings.delete(id); fetchBookings(); } catch {}
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };
    const labels: Record<string, string> = { pending: isArabic ? 'قيد الانتظار' : 'Pending', confirmed: isArabic ? 'مؤكد' : 'Confirmed', cancelled: isArabic ? 'ملغي' : 'Cancelled' };
    return <span className={`text-xs px-2 py-1 rounded-full ${styles[status]}`}>{labels[status]}</span>;
  };

  return (
    <>
      <SEO title={isArabic ? 'الحجوزات' : 'Bookings'} />
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.bookings')}</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary"><Plus className="w-4 h-4" /> {isArabic ? 'إضافة حجز' : 'Add Booking'}</button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="card mb-6">
            <h2 className="text-lg font-semibold mb-4">{isArabic ? 'حجز جديد' : 'New Booking'}</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'النوع' : 'Type'}</label>
                  <select name="type" className="input"><option value="online">{isArabic ? 'أونلاين' : 'Online'}</option><option value="offline">{isArabic ? 'أوفلاين' : 'Offline'}</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'التاريخ' : 'Date'}</label><input type="date" name="date" className="input" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'الوقت' : 'Time'}</label><input type="time" name="time" className="input" required /></div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'المدة (دقيقة)' : 'Duration (min)'}</label><input type="number" name="duration" className="input" defaultValue={60} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'الأماكن' : 'Max Seats'}</label><input type="number" name="maxSeats" className="input" defaultValue={1} required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'رابط الميتابوم' : 'DailyRoom URL'}</label><input type="url" name="dailyRoomUrl" className="input" /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'المكان' : 'Location'}</label><input type="text" name="location" className="input" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'ملاحظات' : 'Notes'}</label><input type="text" name="notes" className="input" /></div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary">{isArabic ? 'إنشاء' : 'Create'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">{t('common.cancel')}</button>
              </div>
            </form>
          </motion.div>
        )}

        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input w-auto mb-6">
          <option value="">{isArabic ? 'جميع الحالات' : 'All Status'}</option>
          <option value="pending">{isArabic ? 'قيد الانتظار' : 'Pending'}</option>
          <option value="confirmed">{isArabic ? 'مؤكد' : 'Confirmed'}</option>
          <option value="cancelled">{isArabic ? 'ملغي' : 'Cancelled'}</option>
        </select>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20"><Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">{t('common.noData')}</p></div>
        ) : (
          <>
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div key={booking.id} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{booking.user?.name} - {booking.type === 'online' ? 'Online' : 'Offline'}</div>
                      <div className="text-sm text-gray-600">{booking.date} {booking.time} - {booking.duration}min</div>
                      <div className="text-xs text-gray-500">{booking.location || booking.dailyRoomUrl || ''} {booking.bookedSeats}/{booking.maxSeats} seats</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusBadge(booking.status)}
                      {booking.status === 'pending' && (
                        <button onClick={() => handleUpdateStatus(booking.id, 'confirmed')} className="text-xs text-green-600 hover:underline">{isArabic ? 'تأكيد' : 'Confirm'}</button>
                      )}
                      <button onClick={() => handleDelete(booking.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline p-2"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-sm text-gray-600">{page} / {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-outline p-2"><ChevronRight className="w-4 h-4" /></button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
