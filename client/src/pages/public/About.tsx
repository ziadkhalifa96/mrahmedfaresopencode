import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Award, BookOpen, Users, MapPin, Phone, CheckCircle, GraduationCap, Heart } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { Section, SectionHeader, Container } from '../../components/ui/Section';

export default function About() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const experience = [
    {
      year: isArabic ? '28 عامًا' : '28 Years',
      title: isArabic ? 'خبرة في التدريس' : 'Teaching Experience',
      description: isArabic
        ? 'تدريس الإنجليزية لطلاب الثانوية العامة المصرية'
        : 'Teaching English for Egyptian Thanaweya Amma students',
    },
    {
      year: isArabic ? 'اسكتلندا' : 'Scotland',
      title: isArabic ? 'دبلومة تدريس الإنجليزية' : 'Diploma in Teaching English',
      description: isArabic
        ? 'دبلومة متقدمة في تدريس اللغة الإنجليزية من اسكتلندا'
        : 'Advanced diploma in teaching English from Scotland',
    },
  ];

  const schools = [
    { name: isArabic ? 'مدرسة نيل الثانوية' : 'Nile Secondary School', icon: BookOpen },
    { name: isArabic ? 'مدرسة الشروق التجريبية Languages School' : 'El Shorouk Experimental Languages School', icon: GraduationCap },
  ];

  const values = [
    {
      icon: Heart,
      title: isArabic ? 'الشغف بالتعليم' : 'Passion for Teaching',
      description: isArabic
        ? 'نؤمن بأن التعليم هو المفتاح للنجاح ونعمل بشغف لتقديم أفضل تجربة تعلم'
        : 'We believe education is the key to success and work passionately to provide the best learning experience',
    },
    {
      icon: Users,
      title: isArabic ? 'التركيز على الطالب' : 'Student-Focused',
      description: isArabic
        ? 'نضع الطالب في مركز كل ما نقدمه من كورسات ودعم مستمر'
        : 'We put the student at the center of everything we offer from courses to continuous support',
    },
    {
      icon: Award,
      title: isArabic ? 'الجودة والتميز' : 'Quality & Excellence',
      description: isArabic
        ? 'نسعى دائمًا للتميز في تقديم المحتوى التعليمي والخدمات'
        : 'We always strive for excellence in educational content and services',
    },
  ];

  return (
    <>
      <SEO
        title={isArabic ? 'من نحن' : 'About Us'}
        description={isArabic
          ? 'تعرف على أحمد فares - مدرس إنجليزى بخبرة 28 عامًا ودبلومة من اسكتلندا'
          : 'Learn about Ahmed Fares - English teacher with 28 years experience and diploma from Scotland'
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
              {isArabic ? 'من نحن' : 'About Us'}
            </h1>
            <p className="text-lg text-white/80">
              {isArabic
                ? 'تعرف على أحمد فares والفريق المتميز خلف أكاديمية أحمد فares للإنجليزية'
                : 'Learn about Ahmed Fares and the distinguished team behind Ahmed Fares English Academy'
              }
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
                    <h2 className="text-2xl font-bold text-gray-900">{isArabic ? 'أحمد فares' : 'Ahmed Fares'}</h2>
                    <p className="text-primary font-medium">{isArabic ? 'مدرس إنجليزى' : 'English Teacher'}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Award className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-700">{isArabic ? '28 عامًا من الخبرة' : '28 Years Experience'}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <GraduationCap className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-700">{isArabic ? 'دبلومة تدريس الإنجليزية - اسكتلندا' : 'Diploma in Teaching English - Scotland'}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-700">{isArabic ? 'بنى سويف' : 'Beni Suef'}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-700">01144258565</span>
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
                {isArabic ? 'مسيرة حافلة بالنجاح' : 'A Journey Full of Success'}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {isArabic
                  ? 'أحمد فares هو مدرس إنجليزى بخبرة 28 عامًا في تعليم الإنجليزية لطلاب الثانوية العامة المصرية. حصل على دبلومة تدريس الإنجليزية من اسكتلندا وعمل في مدرسة نيل الثانوية ومدرسة الشروق التجريبية Languages School.'
                  : 'Ahmed Fares is an English teacher with 28 years of experience teaching English for Egyptian Thanaweya Amma students. He holds a Diploma in Teaching English from Scotland and worked at Nile Secondary School and El Shorouk Experimental Languages School.'
                }
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                {isArabic
                  ? 'يرتوى بتقديم أفضل تجربة تعلم للإنجليزية للطلاب من خلال كورسات شاملة وحصص مباشرة وامتحانات تدريبية مع تصحيح فوري.'
                  : 'He is committed to providing the best English learning experience for students through comprehensive courses, live sessions, and practice exams with instant grading.'
                }
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-xl">
                  <div className="text-3xl font-bold text-primary mb-1">28+</div>
                  <div className="text-sm text-gray-600">{isArabic ? 'عام خبرة' : 'Years Experience'}</div>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-xl">
                  <div className="text-3xl font-bold text-primary mb-1">10K+</div>
                  <div className="text-sm text-gray-600">{isArabic ? 'طالب' : 'Students'}</div>
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
            title={isArabic ? 'الخبرة والمؤهلات' : 'Experience & Qualifications'}
          />
          <div className="grid md:grid-cols-2 gap-8">
            {experience.map((exp, index) => (
              <motion.div
                key={exp.title}
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
                  <div className="text-sm text-primary font-medium mb-1">{exp.year}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{exp.title}</h3>
                  <p className="text-gray-600 text-sm">{exp.description}</p>
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
            title={isArabic ? 'المدارس' : 'Schools'}
            subtitle={isArabic ? 'المدارس التي عمل بها أحمد فares' : 'Schools where Ahmed Fares worked'}
          />
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {schools.map((school, index) => (
              <motion.div
                key={school.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <school.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section className="bg-gray-50">
        <Container>
          <SectionHeader
            title={isArabic ? 'قيمنا' : 'Our Values'}
          />
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
