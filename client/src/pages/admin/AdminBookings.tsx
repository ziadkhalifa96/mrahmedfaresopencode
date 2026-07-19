import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Calendar, Plus, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { adminApi } from '../../services';

export default function AdminBookings() {
  const { t } = useTranslation();
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
    if (!confirm(t('admin.delete_booking_confirm'))) return;
    try { await adminApi.bookings.delete(id); fetchBookings(); } catch {}
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };
    const labels: Record<string, string> = { pending: t('common.pending'), confirmed: t('common.confirmed'), cancelled: t('common.cancelled') };
    return <span className={`text-xs px-2 py-1 rounded-full ${styles[status]}`}>{labels[status]}</span>;
  };

  return (
    <>
      <SEO title={t('seo.adminBookings')} />
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.bookings')}</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary"><Plus className="w-4 h-4" /> {t('admin.add_booking')}</button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="card mb-6">
            <h2 className="text-lg font-semibold mb-4">{t('admin.new_booking')}</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.type')}</label>
                  <select name="type" className="input"><option value="online">{t('admin.online')}</option><option value="offline">{t('admin.offline')}</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.date')}</label><input type="date" name="date" className="input" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.time')}</label><input type="time" name="time" className="input" required /></div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.duration_min')}</label><input type="number" name="duration" className="input" defaultValue={60} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.max_seats')}</label><input type="number" name="maxSeats" className="input" defaultValue={1} required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.daily_room_url')}</label><input type="url" name="dailyRoomUrl" className="input" /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.location')}</label><input type="text" name="location" className="input" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('common.notes')}</label><input type="text" name="notes" className="input" /></div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary">{t('common.create')}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">{t('common.cancel')}</button>
              </div>
            </form>
          </motion.div>
        )}

        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input w-auto mb-6">
          <option value="">{t('common.all_status')}</option>
          <option value="pending">{t('common.pending')}</option>
          <option value="confirmed">{t('common.confirmed')}</option>
          <option value="cancelled">{t('common.cancelled')}</option>
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
                      <div className="font-medium text-gray-900">{booking.user?.name} - {booking.type === 'online' ? t('admin.online') : t('admin.offline')}</div>
                      <div className="text-sm text-gray-600">{booking.date} {booking.time} - {booking.duration}min</div>
                      <div className="text-xs text-gray-500">{booking.location || booking.dailyRoomUrl || ''} {booking.bookedSeats}/{booking.maxSeats} seats</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusBadge(booking.status)}
                      {booking.status === 'pending' && (
                        <button onClick={() => handleUpdateStatus(booking.id, 'confirmed')} className="text-xs text-green-600 hover:underline">{t('admin.confirm')}</button>
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
