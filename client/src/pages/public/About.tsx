import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Award, BookOpen, Users, MapPin, Phone, CheckCircle, GraduationCap, Heart } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { Section, SectionHeader, Container } from '../../components/ui/Section';
import { usePageContent } from '../../hooks/usePageContent';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export default function About() {
  const { t: ui } = useTranslation();
  const { t, section, l, loading } = usePageContent('about');
  const { t: settings, loading: settingsLoading } = useSiteSettings();

  if (loading || settingsLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const experienceData = section('experience');
  const schoolsData = section('schools');
  const valuesData = section('values');

  const schoolIconMap: Record<string, any> = {
    BookOpen,
    GraduationCap,
  };

  const valueIconMap: Record<string, any> = {
    Heart,
    Users,
    Award,
  };

  return (
    <>
      <SEO
        title={ui('seo.about.title')}
        description={ui('seo.about.description')}
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
              {t('hero', 'title') || ui('about.hero_title')}
            </h1>
            <p className="text-lg text-white/80">
              {t('hero', 'subtitle') || ui('about.hero_subtitle')}
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Teacher Profile */}
      <Section>
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl blur-xl"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl font-bold text-primary">AF</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('teacher', 'name') || ui('about.teacher_name')}</h2>
                    <p className="text-primary font-medium">{t('teacher', 'role') || ui('about.teacher_role')}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Award className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-700">{t('teacher', 'experience') || ui('about.experience_28_years')}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <GraduationCap className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-700">{t('teacher', 'diploma') || ui('about.diploma_scotland')}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-700">{t('teacher', 'location') || ui('about.location_beni_suef') || settings('address')}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-700">{settings('phone') || '01144258565'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('journey', 'title') || ui('about.journey_title')}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t('journey', 'paragraph1') || ui('about.journey_p1')}
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                {t('journey', 'paragraph2') || ui('about.journey_p2')}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-xl">
                  <div className="text-3xl font-bold text-primary mb-1">28+</div>
                  <div className="text-sm text-gray-600">{t('stats', 'yearsExperience') || ui('about.years_experience')}</div>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-xl">
                  <div className="text-3xl font-bold text-primary mb-1">10K+</div>
                  <div className="text-sm text-gray-600">{t('stats', 'students') || ui('about.students_stat')}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Experience Timeline */}
      <Section className="bg-gray-50">
        <Container>
          <SectionHeader
            title={t('section', 'experienceTitle') || ui('about.experience_title')}
          />
          <div className="grid md:grid-cols-2 gap-8">
            {experienceData.map((exp, index) => (
              <motion.div
                key={exp.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-primary font-medium mb-1">{l(exp)}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{l(exp, 'title')}</h3>
                  <p className="text-gray-600 text-sm">{l(exp, 'description')}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Schools */}
      <Section>
        <Container>
          <SectionHeader
            title={t('section', 'schoolsTitle') || ui('about.schools_title')}
            subtitle={t('section', 'schoolsSubtitle') || ui('about.schools_subtitle')}
          />
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {schoolsData.map((school, index) => {
              const SchoolIcon = schoolIconMap[school.icon] || BookOpen;
              return (
                <motion.div
                  key={school.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="card text-center"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <SchoolIcon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{l(school)}</h3>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section className="bg-gray-50">
        <Container>
          <SectionHeader
            title={t('section', 'valuesTitle') || ui('about.values_title')}
          />
          <div className="grid md:grid-cols-3 gap-8">
            {valuesData.map((value, index) => {
              const ValueIcon = valueIconMap[value.icon] || Heart;
              return (
                <motion.div
                  key={value.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="card text-center"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <ValueIcon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{l(value)}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{l(value, 'description')}</p>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}