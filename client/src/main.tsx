import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import i18n from './i18n';

// Initialize language from URL or localStorage before rendering
const initLanguage = () => {
  // Try to get lang from URL first
  const pathLang = window.location.pathname.split('/')[1];
  if (pathLang === 'ar' || pathLang === 'en') {
    i18n.changeLanguage(pathLang);
    document.documentElement.lang = pathLang;
    document.documentElement.dir = pathLang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('language', pathLang);
    return;
  }

  // Fallback to localStorage
  const savedLang = localStorage.getItem('language') || 'en';
  i18n.changeLanguage(savedLang);
  document.documentElement.lang = savedLang;
  document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
};

initLanguage();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);