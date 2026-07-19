import { useState, useEffect } from 'react';
import api from '../services/api';
import i18n from '../i18n';

interface GroupedContent {
  [section: string]: {
    [key: string]: {
      en: string;
      ar: string;
      metadata: Record<string, any> | null;
    };
  };
}

export const usePageContent = (page: string) => {
  const [content, setContent] = useState<GroupedContent>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/page-content/${page}`);
      const sectionsData = response.data.sections || response.data.content || {};
      
      const grouped: GroupedContent = {};
      
      Object.entries(sectionsData).forEach(([sectionName, sectionItems]: [string, any]) => {
        grouped[sectionName] = {};
        if (Array.isArray(sectionItems)) {
          sectionItems.forEach((item: any) => {
            const metadata = typeof item.metadata === 'string' ? JSON.parse(item.metadata) : (item.metadata || {});
            grouped[sectionName]![item.key] = {
              en: item.valueEn || item.en || '',
              ar: item.valueAr || item.ar || '',
              metadata,
            };
          });
        } else if (typeof sectionItems === 'object') {
          Object.entries(sectionItems).forEach(([key, val]: [string, any]) => {
            const metadata = typeof val.metadata === 'string' ? JSON.parse(val.metadata) : (val.metadata || {});
            grouped[sectionName]![key] = {
              en: val.en || val.valueEn || '',
              ar: val.ar || val.valueAr || '',
              metadata,
            };
          });
        }
      });
      
      setContent(grouped);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [page]);

  const t = (section: string, key: string): string => {
    const lang = i18n.language;
    return content[section]?.[key]?.[lang as 'en' | 'ar'] || content[section]?.[key]?.['en'] || '';
  };

  const meta = (section: string, key: string): Record<string, any> | null => {
    return content[section]?.[key]?.metadata || null;
  };

  const section = (name: string): any[] => {
    const items = content[name] || {};
    return Object.entries(items).map(([key, val]) => ({
      key,
      en: val.en,
      ar: val.ar,
      ...val.metadata,
    })).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  };

  const l = (obj: Record<string, any>, field?: string): string => {
    const lang = i18n.language as 'en' | 'ar';
    if (field) {
      const suffix = lang === 'ar' ? 'Ar' : 'En';
      const fallback = lang === 'ar' ? 'En' : 'Ar';
      return obj[`${field}${suffix}`] || obj[field] || obj[`${field}${fallback}`] || '';
    }
    return obj[lang] || obj[lang === 'ar' ? 'en' : 'ar'] || '';
  };

  return { content, loading, error, t, meta, section, l, refetch: fetchContent };
};
