import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
  BookOpen, Video, Brain, Users, ArrowRight, Phone,
  MapPin, Star, CheckCircle, Play, Award, Clock, Megaphone, X,
  Sparkles, Target, Globe, Heart, type LucideIcon
} from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { Container } from '../../components/ui/Section';
import ScrollReveal from '../../components/ui/ScrollReveal';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import HeroSlider from '../../components/ui/HeroSlider';
import TestimonialSlider from '../../components/ui/TestimonialSlider';
import FloatingParticles from '../../components/ui/FloatingParticles';
import { publicApi } from '../../services';
import { usePageContent } from '../../hooks/usePageContent';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const iconMap: Record<string, LucideIcon> = {
  BookOpen, Video, Brain, Users, Phone, MapPin,
  Star, CheckCircle, Play, Award, Clock, Megaphone,
  Sparkles, Target, Globe, Heart,
};

export default function Home() {
  const { lang = 'en' } = useParams<{ lang: string }>();
  const { t: ui } = useTranslation();
  const { t, section, l, loading } = usePageContent('home');
  const { loading: settingsLoading } = useSiteSettings();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [dismissed, setDismissed] = useState<number[]>([]);

  useEffect(() => {
    publicApi.getAnnouncements().then((res) => setAnnouncements(res.data.announcements || [])).catch(() => {});
  }, []);

  if (loading || settingsLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary" />
          <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-secondary" style={{ animationDuration: '1.5s' }} />
        </div>
      </div>
    );
  }

  const statsData = section('stats');
  const testimonialsData = section('testimonials');
  const whyChooseUsData = section('whyChooseUs');

  const testimonials = testimonialsData.map((item: any) => ({
    name: l(item),
    role: l(item, 'role'),
    content: l(item, 'content'),
    rating: item.rating || 5,
  }));

  return (
    <>
      <SEO
        title={ui('seo.home.title')}
        description={ui('seo.home.description')}
        keywords={ui('seo.home.keywords')}
      />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Announcements Banner */}
      {announcements.filter((a: any) => !dismissed.includes(a.id)).length > 0 && (
        <div className="bg-gradient-to-r from-secondary/10 via-secondary/5 to-secondary/10 border-b border-secondary/20">
          <Container className="py-3">
            <div className="space-y-2">
              {announcements.filter((a: any) => !dismissed.includes(a.id)).map((ann: any) => (
                <div key={ann.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Megaphone className="w-5 h-5 text-secondary flex-shrink-0" />
                    <p className="text-sm text-gray-800">
                      {lang === 'ar' ? ann.messageAr : ann.message}
                    </p>
                    {ann.link && (
                      <Link to={ann.link.startsWith('/') ? `/${lang}${ann.link}` : ann.link} className="text-sm font-medium text-primary hover:underline flex-shrink-0">
                        {ui('hero.about_us')} →
                      </Link>
                    )}
                  </div>
                  <button onClick={() => setDismissed([...dismissed, ann.id])} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </Container>
        </div>
      )}

      {/* Stats Section - Animated Counters */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden">
        <FloatingParticles count={10} />
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat: any, index: number) => {
              const val = l(stat);
              const num = parseInt(val.replace(/[^0-9]/g, '')) || 0;
              const hasPlus = val.includes('+') || val.includes('آلاف') || val.includes('K');
              return (
                <ScrollReveal key={stat.key} delay={index * 0.1}>
                  <div className="text-center group">
                    <div className="relative inline-block mb-3">
                      <div className="absolute -inset-4 bg-primary/5 rounded-2xl group-hover:bg-primary/10 transition-colors duration-300" />
                      <div className="relative">
                        <AnimatedCounter
                          end={num}
                          suffix={hasPlus ? '+' : ''}
                          className="text-4xl md:text-5xl font-bold gradient-text"
                        />
                      </div>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">{l(stat)}</div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Why Choose Us Section - Premium */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <Container>
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">{lang === 'ar' ? 'ليه تختارنا' : 'Why Us'}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {t('whyChooseUs', 'title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t('whyChooseUs', 'description')}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUsData.map((item: any, index: number) => {
              const IconComponent = iconMap[item.icon] || CheckCircle;
              return (
                <ScrollReveal key={item.key} delay={index * 0.08}>
                  <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 h-full">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow">
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{l(item)}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{l(item, 'description')}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Teacher Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary-dark to-blue-900 text-white relative overflow-hidden">
        <FloatingParticles count={25} />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />
        </div>

        <Container className="relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
                  <Award className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium">{lang === 'ar' ? 'المعلم' : 'Your Teacher'}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  {t('teacher', 'name')}
                </h2>
                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                  {t('teacher', 'bio')}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 bg-white/10 rounded-xl px-5 py-3 backdrop-blur-sm">
                    <Award className="w-5 h-5 text-secondary" />
                    <span className="text-sm font-medium">{lang === 'ar' ? '28 سنة خبرة' : '28 Years Experience'}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 rounded-xl px-5 py-3 backdrop-blur-sm">
                    <BookOpen className="w-5 h-5 text-secondary" />
                    <span className="text-sm font-medium">{lang === 'ar' ? 'دبلومة من اسكتلندا' : 'Scotland Diploma'}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 rounded-xl px-5 py-3 backdrop-blur-sm">
                    <Users className="w-5 h-5 text-secondary" />
                    <span className="text-sm font-medium">{lang === 'ar' ? '+10 آلاف طالب' : '10K+ Students'}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative">
                <div className="absolute -inset-8 bg-gradient-to-r from-secondary/20 to-white/10 rounded-3xl blur-2xl" />
                <div className="relative glass rounded-3xl p-8 border border-white/20">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-secondary to-secondary-dark rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-secondary/30 animate-glow-pulse">
                      <span className="text-4xl font-bold text-white">AF</span>
                    </div>
                    <h3 className="text-2xl font-bold">{t('teacher', 'name')}</h3>
                    <p className="text-white/70">{t('teacher', 'title')}</p>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                    <span className="text-white/80 ml-1">4.9/5</span>
                  </div>

                  <p className="text-center text-white/60 text-sm italic">
                    {lang === 'ar' ? 'تقييم الطلاب' : 'Student Rating'}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <Container>
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-4 py-2 mb-4">
                <Star className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">{lang === 'ar' ? 'آراء الطلاب' : 'Student Reviews'}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {t('testimonials', 'title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t('testimonials', 'subtitle')}
              </p>
            </div>
          </ScrollReveal>

          <TestimonialSlider testimonials={testimonials} />
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <Container>
          <ScrollReveal scale>
            <div className="relative bg-gradient-to-r from-primary via-primary-dark to-blue-900 rounded-3xl p-12 md:p-16 text-center text-white overflow-hidden">
              <FloatingParticles count={15} />
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
              </div>

              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/20"
                >
                  <Play className="w-8 h-8 text-white ml-1" />
                </motion.div>

                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  {t('cta', 'heading') || t('cta', 'title')}
                </h2>
                <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                  {t('cta', 'description')}
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    to="/register"
                    className="group inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl shadow-lg shadow-white/20 hover:shadow-xl hover:bg-gray-100 transition-all duration-300"
                  >
                    {ui('cta_section.register_free')}
                    <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                  </Link>
                  <Link
                    to={`/${lang}/courses`}
                    className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    {ui('cta_section.browse_courses')}
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
