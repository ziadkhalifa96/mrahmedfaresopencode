import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { CreditCard, Search, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Loader2, Eye } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { adminApi } from '../../services';

export default function AdminPayments() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [reviewingPayment, setReviewingPayment] = useState<any>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const response = await adminApi.payments.getAll(params);
      setPayments(response.data.payments);
      setTotalPages(response.data.totalPages);
    } catch {} finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const handleReview = async (status: 'approved' | 'rejected') => {
    if (!reviewingPayment) return;
    const notes = prompt(isArabic ? 'ملاحظات (اختياري):' : 'Notes (optional):');
    try {
      await adminApi.payments.review(reviewingPayment.id, { status, adminNotes: notes || undefined });
      setReviewingPayment(null);
      fetchPayments();
    } catch {}
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };
    const labels: Record<string, string> = { pending: isArabic ? 'قيد المراجعة' : 'Pending', approved: isArabic ? 'مقبول' : 'Approved', rejected: isArabic ? 'مرفوض' : 'Rejected' };
    const icons: Record<string, any> = { pending: Clock, approved: CheckCircle, rejected: XCircle };
    const Icon = icons[status];
    return <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${styles[status]}`}><Icon className="w-3 h-3" />{labels[status]}</span>;
  };

  return (
    <>
      <SEO title={isArabic ? 'المدفوعات' : 'Payments'} />
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('admin.payments')}</h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder={isArabic ? 'بحث بالهاتف...' : 'Search by phone...'} className="input pl-10" />
          </div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input w-auto">
            <option value="">{isArabic ? 'جميع الحالات' : 'All Status'}</option>
            <option value="pending">{isArabic ? 'قيد المراجعة' : 'Pending'}</option>
            <option value="approved">{isArabic ? 'مقبول' : 'Approved'}</option>
            <option value="rejected">{isArabic ? 'مرفوض' : 'Rejected'}</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
        ) : payments.length === 0 ? (
          <div className="text-center py-20"><CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">{t('common.noData')}</p></div>
        ) : (
          <>
            <div className="space-y-3">
              {payments.map((payment) => (
                <motion.div key={payment.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{payment.user?.name}</div>
                        <div className="text-sm text-gray-600">{payment.user?.email}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {payment.amount} EGP - {payment.method === 'vodafone_cash' ? 'Vodafone Cash' : 'InstaPay'} - {payment.senderPhone}
                        </div>
                        {payment.adminNotes && <div className="text-xs text-gray-500 mt-1">{isArabic ? 'ملاحظات:' : 'Notes:'} {payment.adminNotes}</div>}
                        <div className="text-xs text-gray-400 mt-1">{new Date(payment.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-13 sm:ml-0">
                      {statusBadge(payment.status)}
                      {payment.proofImage && (
                        <button onClick={() => setReviewingPayment(payment)} className="p-1 text-gray-400 hover:text-primary">
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {payment.status === 'pending' && (
                        <>
                          <button onClick={() => handleReview('approved')} className="p-1 text-gray-400 hover:text-green-500"><CheckCircle className="w-4 h-4" /></button>
                          <button onClick={() => handleReview('rejected')} className="p-1 text-gray-400 hover:text-red-500"><XCircle className="w-4 h-4" /></button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
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

        {reviewingPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setReviewingPayment(null)}>
            <div className="bg-white rounded-xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-semibold mb-4">{isArabic ? 'إثبات الدفع' : 'Payment Proof'}</h2>
              <img src={reviewingPayment.proofImage} alt="Proof" className="w-full rounded-lg mb-4" />
              <div className="text-sm text-gray-600 mb-4">
                <p>{isArabic ? 'المستخدم:' : 'User:'} {reviewingPayment.user?.name}</p>
                <p>{isArabic ? 'المبلغ:' : 'Amount:'} {reviewingPayment.amount} EGP</p>
                <p>{isArabic ? 'الهاتف:' : 'Phone:'} {reviewingPayment.senderPhone}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleReview('approved')} className="btn-primary bg-green-600 hover:bg-green-700"><CheckCircle className="w-4 h-4" /> {isArabic ? 'قبول' : 'Approve'}</button>
                <button onClick={() => handleReview('rejected')} className="btn-primary bg-red-600 hover:bg-red-700"><XCircle className="w-4 h-4" /> {isArabic ? 'رفض' : 'Reject'}</button>
                <button onClick={() => setReviewingPayment(null)} className="btn-outline">{t('common.cancel')}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
