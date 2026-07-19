import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Lock, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { authApi } from '../../services';

export default function ChangePassword() {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      setError(t('password.mismatch'));
      setSaving(false);
      return;
    }

    try {
      await authApi.changePassword({
        currentPassword: formData.get('currentPassword') as string,
        newPassword,
      });
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || t('password.error'));
    } finally {
      setSaving(false);
    }
  };

  const toggleShow = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const PasswordInput = ({ name, label, field }: { name: string; label: string; field: 'current' | 'new' | 'confirm' }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={showPasswords[field] ? 'text' : 'password'}
          name={name}
          className="input pr-10"
          required
          minLength={6}
        />
        <button type="button" onClick={() => toggleShow(field)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {showPasswords[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <SEO title={t('seo.changePassword')} />
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('password.title')}</h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card max-w-2xl">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{t('password.security')}</h2>
              <p className="text-sm text-gray-600">{t('password.update_subtitle')}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput name="currentPassword" label={t('password.current')} field="current" />
            <PasswordInput name="newPassword" label={t('password.new')} field="new" />
            <PasswordInput name="confirmPassword" label={t('password.confirm')} field="confirm" />

            {success && (
              <div className="bg-success/10 text-success px-4 py-2 rounded-lg text-sm">
                {t('password.changed')}
              </div>
            )}
            {error && (
              <div className="bg-danger/10 text-danger px-4 py-2 rounded-lg text-sm">{error}</div>
            )}

            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {t('password.title')}
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
}
