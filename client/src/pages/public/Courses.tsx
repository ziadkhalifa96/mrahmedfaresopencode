import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Search, BookOpen, Loader2 } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { Section, Container } from '../../components/ui/Section';
import { CourseCard } from '../../components/ui/Cards';
import { coursesApi } from '../../services';
import { localize } from '../../utils/localize';
import type { Course } from '../../types';

export default function Courses() {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await coursesApi.getAll(1, 50);
        setCourses(response.data.data || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const title = localize(course, 'title');
    const desc = localize(course, 'description');
    return title.toLowerCase().includes(search.toLowerCase()) ||
           desc.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <SEO
        title={t('courses.hero_title')}
        description={t('courses.hero_subtitle')}
        keywords={t('seo.courses.keywords') || ''}
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
              {t('courses.hero_title')}
            </h1>
            <p className="text-lg text-white/80">
              {t('courses.hero_subtitle')}
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Search & Filter */}
      <Section className="bg-gray-50">
        <Container>
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('courses.search_placeholder')}
                className="input pl-12 text-lg py-3"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : filteredCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('courses.no_courses')}
              </h3>
              <p className="text-gray-600">
                {t('courses.no_courses_desc')}
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}