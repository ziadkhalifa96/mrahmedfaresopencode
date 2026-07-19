import { useParams, useNavigate, useLocation } from 'react-router';
import i18n from '../i18n';
import { useEffect } from 'react';

export const useLang = () => {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (lang && (lang === 'en' || lang === 'ar')) {
      i18n.changeLanguage(lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('language', lang);
    }
  }, [lang]);

  const switchLang = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    const currentPath = location.pathname;
    const newPath = currentPath.replace(/^\/(ar|en)/, `/${newLang}`) || `/${newLang}`;
    navigate(newPath, { replace: true });
  };

  return {
    lang: lang || 'en',
    isArabic: (lang || 'en') === 'ar',
    switchLang,
    localizePath: (path: string) => `/${lang || 'en'}${path}`,
  };
};
