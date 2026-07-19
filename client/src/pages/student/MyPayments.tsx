import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { CreditCard, Clock, CheckCircle, XCircle, Upload, Loader2 } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { paymentsApi } from '../../services';
import type { Payment } from '../../types';

export default function MyPayments() {
  const { t } = useTranslation();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await paymentsApi.getMyPayments();
        setPayments(response.data.payments || []);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await paymentsApi.submit(formData);
      setShowForm(false);
      const response = await paymentsApi.getMyPayments();
      setPayments(response.data.payments || []);
    } catch {} finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    const labels = {
      pending: t('common.pending'),
      approved: t('common.approved'),
      rejected: t('common.rejected'),
    };
    const icons = { pending: Clock, approved: CheckCircle, rejected: XCircle };
    const Icon = icons[status as keyof typeof icons];
    return (
      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-3 h-3" />
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <>
      <SEO title={t('seo.myPayments')} />
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.myPayments')}</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Upload className="w-4 h-4" />
            {t('payments.new_payment')}
          </button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="card mb-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('payments.submit_proof')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('payments.amount')}
                  </label>
                  <input type="number" name="amount" className="input" required min="1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('payments.payment_method')}
                  </label>
                  <select name="method" className="input" required>
                    <option value="vodafone_cash">Vodafone Cash</option>
                    <option value="instapay">InstaPay</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('payments.sender_phone')}
                </label>
                <input type="tel" name="senderPhone" className="input" required placeholder="01XXXXXXXXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('payments.proof_image')}
                </label>
                <input type="file" name="proofImage" accept="image/*" className="input" required />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {t('common.submit')}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-20">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('payments.no_payments')}
            </h3>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment, index) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{payment.amount} EGP</div>
                    <div className="text-sm text-gray-600">
                      {payment.method === 'vodafone_cash' ? 'Vodafone Cash' : 'InstaPay'} - {payment.senderPhone}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {statusBadge(payment.status)}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
