import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const quickLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/courses', label: t('nav.courses') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AF</span>
              </div>
              <span className="font-bold text-xl">
                {isArabic ? 'أكاديمية أحمد فares' : 'Ahmed Fares Academy'}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="https://wa.me/201144258565" className="hover:text-white transition-colors">
                  01144258565
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  {isArabic
                    ? 'خلف مسجد خاتم المرسلين، بنى سويف'
                    : 'Behind Khatem Al-Morsaleen School, Beni Suef'}
                </span>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Ahmed Fares English Academy. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
}
