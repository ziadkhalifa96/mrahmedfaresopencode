import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Home, ArrowLeft } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { Container } from '../../components/ui/Section';

export default function NotFound() {
  const { lang = 'en' } = useParams<{ lang: string }>();
  const { t } = useTranslation();

  return (
    <>
      <SEO title={t('common.page_not_found')} />
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
              {t('common.page_not_found')}
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {t('common.page_not_found_desc')}
            </p>
            <div className="flex justify-center gap-4">
              <Link to={`/${lang}`} className="btn-primary">
                <Home className="w-4 h-4" />
                {t('common.go_home')}
              </Link>
              <button onClick={() => window.history.back()} className="btn-outline">
                <ArrowLeft className="w-4 h-4" />
                {t('common.go_back')}
              </button>
            </div>
          </motion.div>
        </Container>
      </div>
    </>
  );
}
