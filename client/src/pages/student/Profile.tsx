import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { User, Save, Loader2 } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../services';

export default function Profile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      const formData = new FormData(e.currentTarget);
      await authApi.updateProfile({
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {} finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SEO title={t('seo.profile')} />
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('dashboard.profile')}</h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card max-w-2xl"
        >
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile_page.name')}
              </label>
              <input type="text" name="name" defaultValue={user?.name} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile_page.email')}
              </label>
              <input type="email" defaultValue={user?.email} className="input bg-gray-50" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile_page.phone')}
              </label>
              <input type="tel" name="phone" defaultValue={user?.phone} className="input" required />
            </div>

            {success && (
              <div className="bg-success/10 text-success px-4 py-2 rounded-lg text-sm">
                {t('common.saved_successfully')}
              </div>
            )}

            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {t('common.save')}
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
}
