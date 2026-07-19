import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Phone, MapPin, Clock, Send, MessageCircle, CheckCircle } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { Section, Container } from '../../components/ui/Section';
import { usePageContent } from '../../hooks/usePageContent';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export default function Contact() {
  const { t: ui } = useTranslation();
  const { t, loading } = usePageContent('contact');
  const { t: settings, loading: settingsLoading } = useSiteSettings();
  const [submitted, setSubmitted] = useState(false);

  if (loading || settingsLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const phone = settings('phone') || '01144258565';
  const whatsapp = settings('whatsapp') || '201144258565';
  const address = settings('address') || t('info', 'address');
  const mapCoordinates = settings('map_coordinates') as unknown as Record<string, number> | null;
  const lat = mapCoordinates?.lat || 29.07338889;
  const lng = mapCoordinates?.lng || 31.11063889;

  const contactInfo = [
    {
      icon: Phone,
      title: t('info', 'phoneTitle') || ui('contact.phone_whatsapp'),
      value: phone,
      link: `https://wa.me/${whatsapp}`,
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: MapPin,
      title: t('info', 'locationTitle') || ui('contact.location'),
      value: address,
      link: `https://maps.google.com/?q=${lat},${lng}`,
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: Clock,
      title: t('info', 'hoursTitle') || ui('contact.working_hours'),
      value: t('info', 'hoursValue') || ui('contact.working_hours_value'),
      color: 'bg-blue-100 text-blue-600',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <SEO
        title={ui('seo.contact.title')}
        description={ui('seo.contact.description')}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('hero', 'title') || ui('contact.hero_title')}
            </h1>
            <p className="text-lg text-white/80">
              {t('hero', 'subtitle') || ui('contact.hero_subtitle')}
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Contact Info Cards */}
      <Section className="bg-gray-50">
        <Container>
          <div className="grid md:grid-cols-3 gap-6 -mt-16 relative z-10">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <a
                  href={info.link}
                  target={info.link ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="card text-center hover:shadow-lg transition-all duration-300 block"
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${info.color}`}>
                    <info.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-gray-600 text-sm">{info.value}</p>
                </a>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Contact Form & Map */}
      <Section>
        <Container>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('form', 'title') || ui('contact.send_message')}
              </h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card text-center py-12"
                >
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t('form', 'successTitle') || ui('contact.message_sent')}
                  </h3>
                  <p className="text-gray-600">
                    {t('form', 'successDescription') || ui('contact.message_sent_desc')}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {ui('contact.form_name')}
                      </label>
                      <input type="text" className="input" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {ui('contact.form_email')}
                      </label>
                      <input type="email" className="input" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {ui('contact.form_phone')}
                    </label>
                    <input type="tel" className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {ui('contact.form_subject')}
                    </label>
                    <input type="text" className="input" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {ui('contact.form_message')}
                    </label>
                    <textarea className="input min-h-[150px]" rows={5} required></textarea>
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    <Send className="w-4 h-4" />
                    {ui('contact.form_submit')}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Map & Quick Contact */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Map */}
              <div className="rounded-xl overflow-hidden border border-gray-200 h-[300px]">
                <iframe
                  src={settings('mapEmbedUrl') || `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3484.123456789!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDA0JzI0LjIiTiAzMcKwMDYnMzguMyJF!5e0!3m2!1sen!2seg!4v1234567890`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t('info', 'mapTitle') || ui('contact.map_title')}
                />
              </div>

              {/* Quick WhatsApp */}
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card flex items-center gap-4 hover:shadow-lg transition-all duration-300 bg-green-50 border-green-200"
              >
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{ui('contact.chat_whatsapp')}</h3>
                  <p className="text-gray-600 text-sm">{ui('contact.whatsapp_desc')}</p>
                </div>
              </a>
            </motion.div>
          </div>
        </Container>
      </Section>
    </>
  );
}