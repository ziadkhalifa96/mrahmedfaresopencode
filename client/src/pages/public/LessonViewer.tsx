import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Play, FileText, CheckCircle, Loader2 } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { coursesApi, progressApi } from '../../services';

export default function LessonViewer() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (!lessonId) return;
    const fetchLesson = async () => {
      try {
        const response = await coursesApi.getLesson(parseInt(lessonId));
        setData(response.data);
        setCompleted(false);
      } catch {
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  const handleMarkComplete = async () => {
    if (!lessonId || completing) return;
    setCompleting(true);
    try {
      await progressApi.markComplete(parseInt(lessonId));
      setCompleted(true);
    } catch {} finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const { lesson, chapter, course, siblings } = data;
  const currentIndex = siblings.findIndex((s: any) => s.id === lesson.id);
  const prevLesson = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const nextLesson = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

  return (
    <>
      <SEO title={`${lesson.title} - ${course.title}`} />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <Link to={`/courses/${course.slug}`} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <ArrowLeft className={`w-5 h-5 ${isArabic ? 'rotate-180' : ''}`} />
              </Link>
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{lesson.title}</div>
                <div className="text-xs text-gray-500">{chapter.title}</div>
              </div>
            </div>
            <button
              onClick={handleMarkComplete}
              disabled={completed || completing}
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                completed
                  ? 'bg-success/10 text-success cursor-default'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {completing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {completed ? (isArabic ? 'مكتمل ✓' : 'Completed ✓') : (isArabic ? 'تعليم كمكتمل' : 'Mark Complete')}
            </button>
          </div>
        </div>

        <div className="flex">
          <aside className="hidden lg:block w-72 bg-white border-r min-h-[calc(100vh-57px)] sticky top-[57px]">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">{chapter.title}</h3>
              <div className="space-y-1">
                {siblings.map((s: any) => (
                  <Link
                    key={s.id}
                    to={`/lessons/${s.id}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      s.id === lesson.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex-shrink-0">
                      {s.type === 'video' ? <Play className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </span>
                    <span className="truncate">{isArabic ? s.titleAr : s.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {lesson.type === 'video' && lesson.videoUrl && (
                <div className="aspect-video bg-black rounded-xl overflow-hidden mb-8">
                  <iframe src={lesson.videoUrl} className="w-full h-full" allowFullScreen title={lesson.title} />
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                {lesson.content && <div dangerouslySetInnerHTML={{ __html: lesson.content }} />}
              </div>

              {lesson.contentAr && isArabic && (
                <div className="prose prose-lg max-w-none mt-8" dir="rtl">
                  <div dangerouslySetInnerHTML={{ __html: lesson.contentAr }} />
                </div>
              )}

              {!lesson.content && !lesson.contentAr && (
                <div className="text-center py-20 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>{isArabic ? 'لا يوجد محتوى بعد' : 'No content available yet'}</p>
                </div>
              )}

              <div className="flex items-center justify-between mt-12 pt-8 border-t">
                {prevLesson ? (
                  <Link to={`/lessons/${prevLesson.id}`} className="btn-outline flex items-center gap-2">
                    <ArrowLeft className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
                    {isArabic ? 'الدرس السابق' : 'Previous'}
                  </Link>
                ) : <div />}

                {nextLesson ? (
                  <Link to={`/lessons/${nextLesson.id}`} className="btn-primary flex items-center gap-2">
                    {isArabic ? 'الدرس التالي' : 'Next'}
                    <ArrowRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
                  </Link>
                ) : (
                  <Link to={`/courses/${course.slug}`} className="btn-primary flex items-center gap-2">
                    {isArabic ? 'العودة للكورس' : 'Back to Course'}
                  </Link>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
