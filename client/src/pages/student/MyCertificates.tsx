import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Award, Loader2, Eye } from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../../components/ui/SEO';
import { certificatesApi } from '../../services';
import type { Certificate } from '../../types';

export default function MyCertificates() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await certificatesApi.getMyCertificates();
        setCertificates(response.data.certificates || []);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  return (
    <>
      <SEO title={isArabic ? 'شهاداتي' : 'My Certificates'} />
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('dashboard.myCertificates')}</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-20">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isArabic ? 'لا توجد شهادات بعد' : 'No Certificates Yet'}
            </h3>
            <p className="text-gray-600">
              {isArabic ? 'أكمل كورسًا للحصول على شهادتك' : 'Complete a course to get your certificate'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-7 h-7 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {isArabic ? cert.course?.titleAr : cert.course?.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {isArabic ? 'رقم الشهادة:' : 'Certificate:'} {cert.certificateNumber}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(cert.issuedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    to={`/dashboard/certificates/${cert.id}`}
                    className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium flex-shrink-0"
                  >
                    <Eye className="w-4 h-4" />
                    {isArabic ? 'عرض' : 'View'}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
