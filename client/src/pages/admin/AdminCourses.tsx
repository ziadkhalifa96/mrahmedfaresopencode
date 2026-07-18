import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { BookOpen, Search, Plus, Trash2, Edit, ChevronLeft, ChevronRight, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { adminApi } from '../../services';

export default function AdminCourses() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [courseDetail, setCourseDetail] = useState<any>(null);
  const [showChapterForm, setShowChapterForm] = useState<number | null>(null);
  const [showLessonForm, setShowLessonForm] = useState<number | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 10 };
      if (search) params.search = search;
      const response = await adminApi.courses.getAll(params);
      setCourses(response.data.courses);
      setTotalPages(response.data.totalPages);
    } catch {} finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const handleCourseSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      if (editingCourse) {
        await adminApi.courses.update(editingCourse.id, formData);
      } else {
        await adminApi.courses.create(formData);
      }
      setShowForm(false);
      setEditingCourse(null);
      fetchCourses();
    } catch {}
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm(isArabic ? 'هل تريد حذف هذا الكورس؟' : 'Delete this course?')) return;
    try { await adminApi.courses.delete(id); fetchCourses(); } catch {}
  };

  const toggleExpand = async (courseId: number) => {
    if (expandedCourse === courseId) { setExpandedCourse(null); setCourseDetail(null); return; }
    try {
      const response = await adminApi.courses.getOne(courseId);
      setCourseDetail(response.data.course);
      setExpandedCourse(courseId);
    } catch {}
  };

  const handleChapterSubmit = async (e: React.FormEvent<HTMLFormElement>, courseId: number) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await adminApi.courses.createChapter(courseId, {
        title: formData.get('title') as string,
        titleAr: formData.get('titleAr') as string,
        orderIndex: parseInt(formData.get('orderIndex') as string) || 0,
      });
      setShowChapterForm(null);
      const response = await adminApi.courses.getOne(courseId);
      setCourseDetail(response.data.course);
    } catch {}
  };

  const handleLessonSubmit = async (e: React.FormEvent<HTMLFormElement>, chapterId: number) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await adminApi.courses.createLesson(chapterId, {
        title: formData.get('title') as string,
        titleAr: formData.get('titleAr') as string,
        type: formData.get('type') as string,
        content: formData.get('content') as string,
        contentAr: formData.get('contentAr') as string,
        videoUrl: formData.get('videoUrl') as string,
        duration: parseInt(formData.get('duration') as string) || 0,
        isFree: formData.get('isFree') === 'on',
      });
      setShowLessonForm(null);
      const response = await adminApi.courses.getOne(courseDetail.id);
      setCourseDetail(response.data.course);
    } catch {}
  };

  const handleDeleteChapter = async (chapterId: number, courseId: number) => {
    if (!confirm(isArabic ? 'هل تريد حذف هذا الفصل؟' : 'Delete this chapter?')) return;
    try {
      await adminApi.courses.deleteChapter(chapterId);
      const response = await adminApi.courses.getOne(courseId);
      setCourseDetail(response.data.course);
    } catch {}
  };

  const handleDeleteLesson = async (lessonId: number, courseId: number) => {
    if (!confirm(isArabic ? 'هل تريد حذف هذا الدرس؟' : 'Delete this lesson?')) return;
    try {
      await adminApi.courses.deleteLesson(lessonId);
      const response = await adminApi.courses.getOne(courseId);
      setCourseDetail(response.data.course);
    } catch {}
  };

  return (
    <>
      <SEO title={isArabic ? 'الكورسات' : 'Courses'} />
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.courses')}</h1>
          <button onClick={() => { setShowForm(!showForm); setEditingCourse(null); }} className="btn-primary"><Plus className="w-4 h-4" /> {isArabic ? 'إضافة كورس' : 'Add Course'}</button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="card mb-6">
            <h2 className="text-lg font-semibold mb-4">{editingCourse ? (isArabic ? 'تعديل الكورس' : 'Edit Course') : (isArabic ? 'إضافة كورس' : 'New Course')}</h2>
            <form onSubmit={handleCourseSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" name="title" defaultValue={editingCourse?.title} className="input" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">العنوان بالعربي</label><input type="text" name="titleAr" defaultValue={editingCourse?.titleAr} className="input" required /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea name="description" defaultValue={editingCourse?.description} className="input" rows={3} required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">الوصف بالعربي</label><textarea name="descriptionAr" defaultValue={editingCourse?.descriptionAr} className="input" rows={3} required /></div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'السعر (ج.م)' : 'Price (EGP)'}</label><input type="number" name="price" defaultValue={editingCourse?.price || 0} className="input" min="0" step="0.01" /></div>
                <div className="flex items-center gap-2 mt-6"><input type="checkbox" name="isFree" defaultChecked={editingCourse?.isFree} className="w-4 h-4" /><label className="text-sm">{isArabic ? 'مجاني' : 'Free'}</label></div>
                <div className="flex items-center gap-2 mt-6"><input type="checkbox" name="isPublished" defaultChecked={editingCourse?.isPublished} className="w-4 h-4" /><label className="text-sm">{isArabic ? 'منشور' : 'Published'}</label></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'الصورة المصغرة' : 'Thumbnail'}</label><input type="file" name="thumbnail" accept="image/*" className="input" /></div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary">{editingCourse ? t('common.save') : (isArabic ? 'إنشاء' : 'Create')}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingCourse(null); }} className="btn-outline">{t('common.cancel')}</button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="mb-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder={t('common.search')} className="input pl-10" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20"><BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">{t('common.noData')}</p></div>
        ) : (
          <>
            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course.id} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => toggleExpand(course.id)}>
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-500">{course.titleAr} - {course.chapterCount || 0} {isArabic ? 'فصول' : 'chapters'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${course.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {course.isPublished ? (isArabic ? 'منشور' : 'Published') : (isArabic ? 'مسودة' : 'Draft')}
                      </span>
                      <button onClick={() => { setEditingCourse(course); setShowForm(true); }} className="p-1 text-gray-400 hover:text-primary"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteCourse(course.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      <button onClick={() => toggleExpand(course.id)} className="p-1 text-gray-400">
                        {expandedCourse === course.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {expandedCourse === course.id && courseDetail && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{isArabic ? 'الفصول والدروس' : 'Chapters & Lessons'}</h3>
                        <button onClick={() => setShowChapterForm(course.id)} className="btn-primary text-sm py-1"><Plus className="w-3 h-3" /> {isArabic ? 'إضافة فصل' : 'Add Chapter'}</button>
                      </div>

                      {showChapterForm === course.id && (
                        <form onSubmit={(e) => handleChapterSubmit(e, course.id)} className="bg-gray-50 rounded-lg p-4 mb-3 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" name="title" placeholder="Chapter Title" className="input text-sm" required />
                            <input type="text" name="titleAr" placeholder="عنوان الفصل" className="input text-sm" required />
                          </div>
                          <div className="flex items-center gap-3">
                            <input type="number" name="orderIndex" placeholder="Order" className="input text-sm w-24" defaultValue={0} />
                            <button type="submit" className="btn-primary text-sm py-1">{t('common.save')}</button>
                            <button type="button" onClick={() => setShowChapterForm(null)} className="btn-outline text-sm py-1">{t('common.cancel')}</button>
                          </div>
                        </form>
                      )}

                      {courseDetail.chapters?.map((chapter: any) => (
                        <div key={chapter.id} className="ml-4 mb-3">
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800 text-sm">{chapter.orderIndex}. {chapter.title}</span>
                              <span className="text-gray-400 text-sm">({chapter.titleAr})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => setShowLessonForm(chapter.id)} className="text-xs text-primary hover:underline">+ {isArabic ? 'درس' : 'Lesson'}</button>
                              <button onClick={() => handleDeleteChapter(chapter.id, course.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                            </div>
                          </div>

                          {showLessonForm === chapter.id && (
                            <form onSubmit={(e) => handleLessonSubmit(e, chapter.id)} className="bg-gray-50 rounded-lg p-3 mb-2 space-y-2 ml-4">
                              <div className="grid grid-cols-2 gap-2">
                                <input type="text" name="title" placeholder="Lesson Title" className="input text-sm" required />
                                <input type="text" name="titleAr" placeholder="عنوان الدرس" className="input text-sm" required />
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <select name="type" className="input text-sm">
                                  <option value="text">Text</option>
                                  <option value="video">Video</option>
                                  <option value="quiz">Quiz</option>
                                </select>
                                <input type="number" name="duration" placeholder="Duration (min)" className="input text-sm" />
                                <input type="text" name="videoUrl" placeholder="Video URL" className="input text-sm" />
                              </div>
                              <textarea name="content" placeholder="Content" className="input text-sm" rows={2} />
                              <textarea name="contentAr" placeholder="المحتوى بالعربي" className="input text-sm" rows={2} />
                              <div className="flex items-center gap-3">
                                <button type="submit" className="btn-primary text-sm py-1">{t('common.save')}</button>
                                <button type="button" onClick={() => setShowLessonForm(null)} className="btn-outline text-sm py-1">{t('common.cancel')}</button>
                              </div>
                            </form>
                          )}

                          {chapter.lessons?.map((lesson: any) => (
                            <div key={lesson.id} className="flex items-center justify-between py-1 ml-4 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <span>{lesson.orderIndex}.</span>
                                <span>{lesson.title}</span>
                                <span className="text-xs text-gray-400">({lesson.titleAr})</span>
                                <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{lesson.type}</span>
                                {lesson.isFree && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Free</span>}
                              </div>
                              <button onClick={() => handleDeleteLesson(lesson.id, course.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline p-2"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-sm text-gray-600">{page} / {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-outline p-2"><ChevronRight className="w-4 h-4" /></button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
