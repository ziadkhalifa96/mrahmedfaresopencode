import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Loader2, ArrowLeft, Printer, Download } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { certificatesApi } from '../../services';
import { localize } from '../../utils/localize';
import type { Certificate } from '../../types';

export default function CertificateView() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await certificatesApi.getMyCertificates();
        const certs = response.data.certificates || [];
        const found = certs.find((c: Certificate) => c.id === Number(id));
        setCertificate(found || null);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, [id]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">{t('certificates.not_found')}</p>
        <Link to="/dashboard/certificates" className="btn-primary">
          {t('certificates.back_to_certs')}
        </Link>
      </div>
    );
  }

  const issuedDate = new Date(certificate.issuedAt).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <>
      <SEO title={`${i18n.language === 'ar' ? 'شهادة' : 'Certificate -'} ${certificate.course ? localize(certificate.course, 'title') : ''}`} />
      <div className="min-h-screen bg-gray-100 print:bg-white">
        <div className="no-print bg-white border-b sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/dashboard/certificates" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className={`w-5 h-5 ${i18n.language === 'ar' ? 'rotate-180' : ''}`} />
              {t('common.back')}
            </Link>
            <div className="flex gap-3">
              <button onClick={handlePrint} className="btn-outline flex items-center gap-2">
                <Printer className="w-4 h-4" />
                {t('certificates.print')}
              </button>
              <button onClick={handlePrint} className="btn-primary flex items-center gap-2">
                <Download className="w-4 h-4" />
                {t('certificates.download')}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-8 print:p-0">
          <div className="bg-white rounded-2xl shadow-2xl print:shadow-none print:rounded-none w-full max-w-4xl aspect-[1.414] flex flex-col items-center justify-between p-12 print:p-16 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,0.05) 35px, rgba(0,0,0,0.05) 36px)',
              }} />
            </div>
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-secondary to-primary" />

            <div className="relative text-center w-full">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary">AF</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {t('certificates.academy_name')}
              </h1>
              <p className="text-gray-500 text-sm">{t('certificates.academy_subtitle')}</p>
            </div>

            <div className="relative text-center w-full my-auto">
              <h2 className="text-lg font-medium text-gray-500 uppercase tracking-widest mb-2">
                {t('certificates.completion')}
              </h2>
              <div className="w-24 h-0.5 bg-primary mx-auto mb-6" />

              <p className="text-gray-600 mb-2">{t('certificates.certifies_that')}</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-4 border-b-2 border-primary/30 inline-block px-8 pb-1">
                {certificate.user?.name || t('certificates.student_fallback')}
              </h3>
              <p className="text-gray-600 mb-2">
                {t('certificates.completed_text')}
              </p>
              <h4 className="text-2xl font-bold text-primary mb-4">
                {certificate.course ? localize(certificate.course, 'title') : ''}
              </h4>
              <p className="text-gray-500 text-sm">{issuedDate}</p>
            </div>

            <div className="relative w-full flex justify-between items-end mt-8">
              <div className="text-center">
                <div className="w-40 border-b border-gray-400 mb-2" />
                <p className="text-sm text-gray-500">{i18n.language === 'ar' ? 'أ/احمد فارس' : 'Ahmed Fares'}</p>
                <p className="text-xs text-gray-400">{t('certificates.director')}</p>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">
                  {t('certificates.cert_number')}
                </div>
                <div className="font-mono font-bold text-primary">{certificate.certificateNumber}</div>
              </div>
              <div className="text-center">
                <div className="w-40 border-b border-gray-400 mb-2" />
                <p className="text-sm text-gray-500">{t('certificates.issue_date')}</p>
                <p className="text-xs text-gray-400">{issuedDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
