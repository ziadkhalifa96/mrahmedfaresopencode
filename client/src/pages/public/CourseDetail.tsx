import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, CheckCircle, Play, Loader2, Lock, FileText } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { Section, Container } from '../../components/ui/Section';
import { coursesApi, enrollmentsApi } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import type { Course, Chapter } from '../../types';

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!slug) return;
      try {
        const response = await coursesApi.getBySlug(slug);
        setCourse(response.data.course);

        if (response.data.course?.id) {
          const chaptersRes = await coursesApi.getChapters(response.data.course.id);
          setChapters(chaptersRes.data.chapters || []);
        }
      } catch {} finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user || !course) return;
      try {
        const response = await enrollmentsApi.getMyEnrollments();
        const enrollments = response.data.enrollments || [];
        setEnrolled(enrollments.some((e) => e.courseId === course.id));
      } catch {}
    };
    checkEnrollment();
  }, [user, course]);

  const handleEnroll = async () => {
    if (!course || !user) return;
    setEnrolling(true);
    try {
      await enrollmentsApi.enroll(course.id);
      setEnrolled(true);
    } catch {} finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isArabic ? 'الكورس غير موجود' : 'Course Not Found'}
          </h2>
          <Link to="/courses" className="text-primary hover:underline">
            {isArabic ? 'العودة للكورسات' : 'Back to Courses'}
          </Link>
        </div>
      </div>
    );
  }

  const title = isArabic ? course.titleAr : course.title;
  const description = isArabic ? course.descriptionAr : course.description;
  const totalLessons = chapters.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0);

  return (
    <>
      <SEO title={title} description={description} image={course.thumbnail} />

      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16">
        <Container>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link to="/courses" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
              {isArabic ? 'العودة للكورسات' : 'Back to Courses'}
            </Link>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
                <p className="text-lg text-white/80 mb-6">{description}</p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-white/80">
                    <BookOpen className="w-5 h-5" />
                    <span>{chapters.length} {isArabic ? 'فصول' : 'Chapters'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <FileText className="w-5 h-5" />
                    <span>{totalLessons} {isArabic ? 'درس' : 'Lessons'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-2xl font-bold ${course.isFree ? 'text-green-400' : 'text-yellow-400'}`}>
                    {course.isFree ? (isArabic ? 'مجاني' : 'Free') : `${course.price} EGP`}
                  </span>
                  {user ? (
                    enrolled ? (
                      <span className="btn bg-white/20 text-white cursor-default flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> {isArabic ? 'مسجل بالفعل' : 'Enrolled'}
                      </span>
                    ) : (
                      <button onClick={handleEnroll} disabled={enrolling} className="btn bg-white text-primary hover:bg-gray-100">
                        {enrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {isArabic ? 'سجل الآن' : 'Enroll Now'}
                      </button>
                    )
                  ) : (
                    <Link to="/login" className="btn bg-white text-primary hover:bg-gray-100">
                      {isArabic ? 'سجل دخول للتسجيل' : 'Login to Enroll'}
                    </Link>
                  )}
                </div>
              </div>
              <div className="hidden md:block">
                <div className="aspect-video bg-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl font-bold text-white/20">AF</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {isArabic ? 'محتوى الكورس' : 'Course Content'}
            </h2>

            {chapters.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {isArabic ? 'سيتم إضافة المحتوى قريبًا' : 'Content will be added soon'}
              </div>
            ) : (
              <div className="space-y-4">
                {chapters.map((chapter, chapterIndex) => (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: chapterIndex * 0.1 }}
                    className="card"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm font-bold text-primary">
                        {chapterIndex + 1}
                      </span>
                      {isArabic ? chapter.titleAr : chapter.title}
                    </h3>
                    {chapter.lessons && chapter.lessons.length > 0 ? (
                      <div className="space-y-2">
                        {chapter.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                              enrolled || lesson.isFree
                                ? 'hover:bg-gray-50 cursor-pointer'
                                : 'opacity-75'
                            }`}
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              {lesson.type === 'video' ? <Play className="w-4 h-4 text-gray-600" />
                                : lesson.type === 'quiz' ? <CheckCircle className="w-4 h-4 text-purple-600" />
                                : <FileText className="w-4 h-4 text-gray-600" />
                              }
                            </div>
                            <div className="flex-1">
                              {enrolled || lesson.isFree ? (
                                <Link to={`/lessons/${lesson.id}`} className="text-sm font-medium text-gray-700 hover:text-primary">
                                  {isArabic ? lesson.titleAr : lesson.title}
                                </Link>
                              ) : (
                                <span className="text-sm font-medium text-gray-700">
                                  {isArabic ? lesson.titleAr : lesson.title}
                                </span>
                              )}
                              {lesson.duration > 0 && (
                                <span className="text-xs text-gray-500 ml-2">
                                  {lesson.duration} {isArabic ? 'دقيقة' : 'min'}
                                </span>
                              )}
                            </div>
                            {lesson.isFree ? (
                              <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                                {isArabic ? 'مجاني' : 'Free'}
                              </span>
                            ) : !enrolled ? (
                              <Lock className="w-4 h-4 text-gray-400" />
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 pl-10">
                        {isArabic ? 'لا توجد دروس بعد' : 'No lessons yet'}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
