import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Loader2 } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { adminApi } from '../../services';

export default function AdminSettings() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await adminApi.settings.get();
        setSettings(response.data.settings || {});
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updates: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (key.startsWith('setting_')) {
        const settingKey = key.replace('setting_', '');
        try {
          const parsed = JSON.parse(value as string);
          updates[settingKey] = parsed;
        } catch {
          updates[settingKey] = value;
        }
      }
    }

    setSaving(true);
    try {
      for (const [key, value] of Object.entries(updates)) {
        await adminApi.settings.update(key, value);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {} finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  const settingGroups = [
    {
      title: isArabic ? 'معلومات الموقع' : 'Site Info',
      keys: ['siteName', 'siteNameAr', 'siteDescription', 'siteDescriptionAr', 'contactPhone', 'contactEmail', 'contactAddress', 'contactAddressAr'],
    },
    {
      title: isArabic ? 'وسائل التواصل الاجتماعي' : 'Social Media',
      keys: ['facebook', 'instagram', 'youtube', 'whatsapp', 'telegram'],
    },
    {
      title: isArabic ? 'الإعدادات العامة' : 'General',
      keys: ['currency', 'defaultLanguage'],
    },
  ];

  return (
    <>
      <SEO title={isArabic ? 'الإعدادات' : 'Settings'} />
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('admin.settings')}</h1>

        <form onSubmit={handleFormSubmit} className="space-y-8">
          {settingGroups.map((group) => (
            <div key={group.title} className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b">{group.title}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {group.keys.map((key) => {
                  const currentValue = settings[key];
                  const displayValue = typeof currentValue === 'object' ? JSON.stringify(currentValue) : (currentValue || '');
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
                      <input
                        type="text"
                        name={`setting_${key}`}
                        defaultValue={displayValue}
                        className="input"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {success && (
            <div className="bg-success/10 text-success px-4 py-2 rounded-lg text-sm">
              {isArabic ? 'تم الحفظ بنجاح' : 'Settings saved successfully'}
            </div>
          )}

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {t('common.save')}
          </button>
        </form>
      </div>
    </>
  );
}
