import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export default function SEO({ title, description, keywords, image, url }: SEOProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const defaultTitle = isArabic
    ? 'أكاديمية أحمد فares للإنجليزية'
    : 'Ahmed Fares English Academy';

  const defaultDescription = isArabic
    ? 'منصة تعلم الإنجليزية المتميزة لطلاب الثانوية العامة المصرية - 28 عامًا من الخبرة'
    : 'Premium English learning platform for Egyptian Thanaweya Amma students - 28 years of experience';

  const fullTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <html lang={isArabic ? 'ar' : 'en'} dir={isArabic ? 'rtl' : 'ltr'} />
    </Helmet>
  );
}
