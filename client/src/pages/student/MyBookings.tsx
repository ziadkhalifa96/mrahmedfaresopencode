import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Video, XCircle, Loader2 } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { bookingsApi } from '../../services';
import type { Booking } from '../../types';

export default function MyBookings() {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingsApi.getMyBookings();
        setBookings(response.data.bookings || []);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (id: number) => {
    if (!confirm(t('bookings.cancel_confirm'))) return;
    try {
      await bookingsApi.cancel(id);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    } catch {}
  };

  const statusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    const labels = {
      pending: t('common.pending'),
      confirmed: t('common.confirmed'),
      cancelled: t('common.cancelled'),
    };
    return <span className={`text-xs px-2 py-1 rounded-full ${styles[status as keyof typeof styles]}`}>{labels[status as keyof typeof labels]}</span>;
  };

  return (
    <>
      <SEO title={t('seo.myBookings')} />
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('dashboard.myBookings')}</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('bookings.empty')}
            </h3>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="card"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      booking.type === 'online' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {booking.type === 'online' ? <Video className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {booking.type === 'online' ? t('bookings.online') : t('bookings.offline')}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {booking.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {booking.time}
                        </span>
                      </div>
                      {booking.location && (
                        <div className="text-xs text-gray-500 mt-1">{booking.location}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusBadge(booking.status)}
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
