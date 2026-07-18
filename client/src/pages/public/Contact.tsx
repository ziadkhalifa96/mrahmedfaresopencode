import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Phone, MapPin, Clock, Send, MessageCircle, CheckCircle } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { Section, Container } from '../../components/ui/Section';

export default function Contact() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: Phone,
      title: isArabic ? 'الهاتف / واتساب' : 'Phone / WhatsApp',
      value: '01144258565',
      link: 'https://wa.me/201144258565',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: MapPin,
      title: isArabic ? 'العنوان' : 'Location',
      value: isArabic ? 'خلف مسجد خاتم المرسلين، بنى سويف' : 'Behind Khatem Al-Morsaleen School, Beni Suef',
      link: 'https://maps.google.com/?q=29.07338889,31.11063889',
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: Clock,
      title: isArabic ? 'أوقات الدوام' : 'Working Hours',
      value: isArabic ? 'السبت - الخميس: 10 ص - 8 م' : 'Saturday - Thursday: 10 AM - 8 PM',
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
        title={isArabic ? 'اتصل بنا' : 'Contact Us'}
        description={isArabic
          ? 'تواصل مع أكاديمية أحمد فares للإنجليزية - الهاتف والعنوان وأوقات الدوام'
          : 'Contact Ahmed Fares English Academy - Phone, location, and working hours'
        }
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
              {isArabic ? 'اتصل بنا' : 'Contact Us'}
            </h1>
            <p className="text-lg text-white/80">
              {isArabic
                ? 'نحن هنا لمساعدتك. تواصل معنا لأي استفسار'
                : 'We are here to help. Contact us for any inquiries'
              }
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
                {isArabic ? 'أرسل رسالة' : 'Send a Message'}
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
                    {isArabic ? 'تم الإرسال بنجاح!' : 'Message Sent Successfully!'}
                  </h3>
                  <p className="text-gray-600">
                    {isArabic
                      ? 'سنقوم بالرد عليك في أقرب وقت'
                      : 'We will get back to you as soon as possible'
                    }
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isArabic ? 'الاسم' : 'Name'}
                      </label>
                      <input type="text" className="input" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isArabic ? 'البريد الإلكتروني' : 'Email'}
                      </label>
                      <input type="email" className="input" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isArabic ? 'الهاتف' : 'Phone'}
                    </label>
                    <input type="tel" className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isArabic ? 'الموضوع' : 'Subject'}
                    </label>
                    <input type="text" className="input" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isArabic ? 'الرسالة' : 'Message'}
                    </label>
                    <textarea className="input min-h-[150px]" rows={5} required></textarea>
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    <Send className="w-4 h-4" />
                    {isArabic ? 'إرسال' : 'Send Message'}
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3484.123456789!2d31.11063889!3d29.07338889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDA0JzI0LjIiTiAzMcKwMDYnMzguMyJF!5e0!3m2!1sen!2seg!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={isArabic ? 'موقع أكاديمية أحمد فares' : 'Ahmed Fares Academy Location'}
                />
              </div>

              {/* Quick WhatsApp */}
              <a
                href="https://wa.me/201144258565"
                target="_blank"
                rel="noopener noreferrer"
                className="card flex items-center gap-4 hover:shadow-lg transition-all duration-300 bg-green-50 border-green-200"
              >
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{isArabic ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}</h3>
                  <p className="text-gray-600 text-sm">{isArabic ? 'رد سريع على استفساراتك' : 'Quick response to your inquiries'}</p>
                </div>
              </a>
            </motion.div>
          </div>
        </Container>
      </Section>
    </>
  );
}
