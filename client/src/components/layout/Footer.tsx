import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export default function Footer() {
  const { lang = 'en' } = useParams<{ lang: string }>();
  const { t: ui } = useTranslation();
  const { t: settings } = useSiteSettings();

  const phone = settings('phone') || '01144258565';
  const whatsapp = settings('whatsapp') || '201144258565';
  const address = settings('address') || ui('footer.address');
  const socialFb = settings('social_facebook');
  const socialIg = settings('social_instagram');
  const socialYt = settings('social_youtube');

  const quickLinks = [
    { to: `/${lang}`, label: ui('nav.home') },
    { to: `/${lang}/courses`, label: ui('nav.courses') },
    { to: `/${lang}/blog`, label: ui('nav.blog') },
    { to: `/${lang}/about`, label: ui('nav.about') },
    { to: `/${lang}/contact`, label: ui('nav.contact') },
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
                {settings('site_name_short') || ui('footer.academy_name')}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {ui('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{ui('footer.quickLinks')}</h3>
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
            <h3 className="font-semibold text-lg mb-4">{ui('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href={`https://wa.me/${whatsapp}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              {socialFb && (
                <a href={socialFb} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {socialIg && (
                <a href={socialIg} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {socialYt && (
                <a href={socialYt} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {!socialFb && !socialIg && !socialYt && (
                <>{/* Hidden placeholder for empty state */}</>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} {settings('site_name_short') || ui('footer.academy_name')}. {ui('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
}