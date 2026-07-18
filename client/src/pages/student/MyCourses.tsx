import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { BookOpen, Clock, CheckCircle, Loader2 } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { enrollmentsApi } from '../../services';
import type { Enrollment } from '../../types';

export default function MyCourses() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await enrollmentsApi.getMyEnrollments();
        setEnrollments(response.data.enrollments || []);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  return (
    <>
      <SEO title={isArabic ? 'كورساتي' : 'My Courses'} />
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('dashboard.myCourses')}</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isArabic ? 'لم تسجل في أي كورس بعد' : 'No courses enrolled yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isArabic ? 'ابدأ رحلة التعلم الآن' : 'Start your learning journey now'}
            </p>
            <Link to="/courses" className="btn-primary">
              {isArabic ? 'تصفح الكورسات' : 'Browse Courses'}
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {enrollments.map((enrollment, index) => {
              const course = enrollment.course;
              const title = isArabic ? course?.titleAr : course?.title;
              return (
                <motion.div
                  key={enrollment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    to={`/courses/${course?.slug}`}
                    className="card hover:shadow-md transition-shadow block"
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex-shrink-0 flex items-center justify-center">
                        {course?.thumbnail ? (
                          <img src={course.thumbnail} alt={title} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span className="text-xl font-bold text-primary/30">AF</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                            enrollment.status === 'completed'
                              ? 'bg-success/10 text-success'
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {enrollment.status === 'completed' ? (
                              <><CheckCircle className="w-3 h-3" /> {isArabic ? 'مكتمل' : 'Completed'}</>
                            ) : (
                              <><Clock className="w-3 h-3" /> {isArabic ? 'جاري' : 'In Progress'}</>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
