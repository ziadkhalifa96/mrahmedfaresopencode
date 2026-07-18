import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Home, ArrowLeft } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { Container } from '../../components/ui/Section';

export default function NotFound() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <>
      <SEO title={isArabic ? 'الصفحة غير موجودة' : 'Page Not Found'} />
      <div className="min-h-[80vh] flex items-center justify-center">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="text-9xl font-bold text-primary/20 mb-4">404</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {isArabic ? 'الصفحة غير موجودة' : 'Page Not Found'}
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {isArabic
                ? 'عذرًا، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'
                : 'Sorry, the page you are looking for does not exist or has been moved.'
              }
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/" className="btn-primary">
                <Home className="w-4 h-4" />
                {isArabic ? 'الرئيسية' : 'Home'}
              </Link>
              <button onClick={() => window.history.back()} className="btn-outline">
                <ArrowLeft className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
                {isArabic ? 'رجوع' : 'Go Back'}
              </button>
            </div>
          </motion.div>
        </Container>
      </div>
    </>
  );
}
