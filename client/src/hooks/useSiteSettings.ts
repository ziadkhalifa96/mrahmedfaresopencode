import { useState, useEffect } from 'react';
import api from '../services/api';
import i18n from '../i18n';

interface SiteSettings {
  [key: string]: any;
}

const tryParse = (val: any): any => {
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return val; }
  }
  return val;
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/public/site-settings');
        setSettings(response.data?.settings || {});
      } catch {
        // Settings will be empty, app continues with fallbacks
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const t = (key: string): string => {
    const obj = settings || {};
    const val = tryParse(obj[key]);
    if (!val) return '';
    if (typeof val === 'object' && val.en != null && val.ar != null) {
      return val[i18n.language as 'en' | 'ar'] || val.en || '';
    }
    if (typeof val === 'string') return val;
    if (typeof val === 'object' && val.url != null) return val.url;
    return '';
  };

  const get = (key: string) => {
    const obj = settings || {};
    return tryParse(obj[key]) || null;
  };

  return { settings, loading, t, get };
};
