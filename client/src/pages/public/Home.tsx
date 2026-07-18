import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
  BookOpen, Video, Brain, Users, ArrowRight, Phone,
  MapPin, Star, CheckCircle, Play, Award, Clock, Megaphone, X
} from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { Section, SectionHeader, Container } from '../../components/ui/Section';
import { FeatureCard, TestimonialCard } from '../../components/ui/Cards';
import { publicApi } from '../../services';

export default function Home() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [dismissed, setDismissed] = useState<number[]>([]);

  useEffect(() => {
    publicApi.getAnnouncements().then((res) => setAnnouncements(res.data.announcements || [])).catch(() => {});
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: t('features.courses.title'),
      description: t('features.courses.description'),
    },
    {
      icon: Video,
      title: t('features.live.title'),
      description: t('features.live.description'),
    },
    {
      icon: Brain,
      title: t('features.exams.title'),
      description: t('features.exams.description'),
    },
    {
      icon: Users,
      title: t('features.ai.title'),
      description: t('features.ai.description'),
    },
  ];

  const stats = [
    { number: '28+', label: isArabic ? 'عام خبرة' : 'Years Experience' },
    { number: '10K+', label: isArabic ? 'طالب' : 'Students' },
    { number: '50+', label: isArabic ? 'كورس' : 'Courses' },
    { number: '95%', label: isArabic ? 'نسبة النجاح' : 'Success Rate' },
  ];

  const testimonials = [
    {
      name: isArabic ? 'محمد أحمد' : 'Mohamed Ahmed',
      role: isArabic ? 'طالب ثانوية عامة' : 'Thanaweya Amma Student',
      content: isArabic
        ? 'بفضل أحمد فares نجحت في الامتحانات بدرجة ممتازة. طريقة الشرح واضحة وممتعة.'
        : 'Thanks to Ahmed Fares, I passed my exams with excellent grades. The teaching method is clear and enjoyable.',
      rating: 5,
    },
    {
      name: isArabic ? 'سارة علي' : 'Sara Ali',
      role: isArabic ? 'طالب ثانوية عامة' : 'Thanaweya Amma Student',
      content: isArabic
        ? 'الكورسات ممتازة والامتحانات التدريبية ساعدتني كثيرًا. أنصح الجميع بالاشتراك.'
        : 'The courses are excellent and the practice exams helped me a lot. I recommend everyone to subscribe.',
      rating: 5,
    },
    {
      name: isArabic ? 'عمر حسن' : 'Omar Hassan',
      role: isArabic ? 'طالب ثانوية عامة' : 'Thanaweya Amma Student',
      content: isArabic
        ? 'أحمد فares أفضل مدرس إنجليزى تعاملت معاه. الخبرة 28 عامًا بتظهر في طريقة التدريس.'
        : 'Ahmed Fares is the best English teacher I have dealt with. The 28 years of experience shows in the teaching method.',
      rating: 5,
    },
  ];

  const whyChooseUs = [
    { icon: Award, text: isArabic ? '28 عامًا من الخبرة في التدريس' : '28 years of teaching experience' },
    { icon: CheckCircle, text: isArabic ? 'دبلومة تدريس الإنجليزية من اسكتلندا' : 'Diploma in Teaching English from Scotland' },
    { icon: Users, text: isArabic ? 'أكثر من 10,000 طالب' : 'Over 10,000 students' },
    { icon: Clock, text: isArabic ? 'دعم مستمر طوال العام' : 'Continuous support throughout the year' },
    { icon: Play, text: isArabic ? 'حصص مباشرة وأوفلاين' : 'Live and offline sessions' },
    { icon: Brain, text: isArabic ? 'أدوات ذكاء اصطناعي للتعلم' : 'AI-powered learning tools' },
  ];

  return (
    <>
      <SEO
        title={isArabic ? 'الرئيسية' : 'Home'}
        description={isArabic
          ? 'منصة تعلم الإنجليزية المتميزة لطلاب الثانوية العامة المصرية - أحمد فares بخبرة 28 عامًا'
          : 'Premium English learning platform for Egyptian Thanaweya Amma - Ahmed Fares with 28 years of experience'
        }
        keywords={isArabic
          ? 'إنجليزية, ثانوية عامة, أحمد فares, تعليم, كورسات'
          : 'english, thanaweya amma, ahmed fares, education, courses'
        }
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-blue-900 text-white overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        </div>

        <Container className="relative py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: isArabic ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
              >
                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                <span className="text-sm">{isArabic ? 'أحمد فares - خبرة 28 عامًا' : 'Ahmed Fares - 28 Years Experience'}</span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Link
                  to="/courses"
                  className="btn bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3 shadow-lg shadow-white/20"
                >
                  {t('hero.cta')}
                  <ArrowRight className={`w-5 h-5 ${isArabic ? 'rotate-180' : ''}`} />
                </Link>
                <Link
                  to="/about"
                  className="btn border-2 border-white/30 text-white hover:bg-white/10 text-lg px-8 py-3"
                >
                  {isArabic ? 'من نحن' : 'About Us'}
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="https://wa.me/201144258565"
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">01144258565</span>
                </a>
                <span className="text-white/30">|</span>
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{isArabic ? 'بنى سويف' : 'Beni Suef'}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isArabic ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-3xl blur-2xl"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                        className="text-center p-4 bg-white/5 rounded-2xl"
                      >
                        <div className="text-3xl font-bold mb-1">{stat.number}</div>
                        <div className="text-sm text-white/70">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-white/5 rounded-2xl text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm text-white/80">4.9/5</span>
                    </div>
                    <p className="text-xs text-white/60">{isArabic ? 'تقييم الطلاب' : 'Student Rating'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Announcements Banner */}
      {announcements.filter((a) => !dismissed.includes(a.id)).length > 0 && (
        <div className="bg-secondary/10 border-b border-secondary/20">
          <Container className="py-3">
            <div className="space-y-2">
              {announcements.filter((a) => !dismissed.includes(a.id)).map((ann) => (
                <div key={ann.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Megaphone className="w-5 h-5 text-secondary flex-shrink-0" />
                    <p className="text-sm text-gray-800">
                      {isArabic ? ann.messageAr : ann.message}
                    </p>
                    {ann.link && (
                      <Link to={ann.link} className="text-sm font-medium text-primary hover:underline flex-shrink-0">
                        {isArabic ? '详情' : 'Learn more'} →
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

      {/* Features Section */}
      <Section className="bg-gray-50">
        <Container>
          <SectionHeader
            title={t('features.title')}
            subtitle={t('features.subtitle')}
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* Why Choose Us Section */}
      <Section>
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: isArabic ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title mb-6">
                {isArabic ? 'لماذا تختار أكاديمية أحمد فares؟' : 'Why Choose Ahmed Fares Academy?'}
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {isArabic
                  ? 'مع 28 عامًا من الخبرة في تدريس الإنجليزية للثانوية العامة المصرية، نقدم أفضل تجربة تعلم متكاملة تشمل الكورسات والحصص المباشرة والامتحانات التدريبية.'
                  : 'With 28 years of experience teaching English for Egyptian Thanaweya Amma, we provide the best comprehensive learning experience including courses, live sessions, and practice exams.'
                }
              </p>
              <div className="space-y-4">
                {whyChooseUs.map((item, index) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-gray-700">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isArabic ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-primary">AF</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{isArabic ? 'أحمد فares' : 'Ahmed Fares'}</h3>
                  <p className="text-gray-500 text-sm">{isArabic ? 'مدرس إنجليزى' : 'English Teacher'}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Award className="w-5 h-5 text-primary" />
                    <span className="text-sm text-gray-700">{isArabic ? '28 عامًا من الخبرة' : '28 Years Experience'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="text-sm text-gray-700">{isArabic ? 'دبلومة من اسكتلندا' : 'Diploma from Scotland'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-sm text-gray-700">{isArabic ? '10,000+ طالب' : '10,000+ Students'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Testimonials Section */}
      <Section className="bg-gray-50">
        <Container>
          <SectionHeader
            title={isArabic ? 'ماذا يقول طلابنا' : 'What Our Students Say'}
            subtitle={isArabic ? 'آراء حقيقية من طلاب حققوا نجاحًا' : 'Real reviews from students who achieved success'}
          />
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.name}
                {...testimonial}
                index={index}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* Stats Section */}
      <Section className="bg-primary text-white">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section>
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-12 text-center text-white relative overflow-hidden"
          >
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {isArabic ? 'جاهز للبدء في رحلة التعلم؟' : 'Ready to Start Your Learning Journey?'}
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                {isArabic
                  ? 'انضم الآن إلى آلاف الطلاب الذين حققوا نجاحًا في الثانوية العامة مع أحمد فares'
                  : 'Join thousands of students who achieved success in Thanaweya Amma with Ahmed Fares'
                }
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register" className="btn bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3 shadow-lg">
                  {isArabic ? 'سجل الآن مجانًا' : 'Register Now Free'}
                  <ArrowRight className={`w-5 h-5 ${isArabic ? 'rotate-180' : ''}`} />
                </Link>
                <Link to="/courses" className="btn border-2 border-white/30 text-white hover:bg-white/10 text-lg px-8 py-3">
                  {isArabic ? 'تصفح الكورسات' : 'Browse Courses'}
                </Link>
              </div>
            </div>
          </motion.div>
        </Container>
      </Section>
    </>
  );
}
