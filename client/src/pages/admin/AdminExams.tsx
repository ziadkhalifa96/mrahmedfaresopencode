import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Award, Plus, Trash2, Edit, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { adminApi } from '../../services';

export default function AdminExams() {
  const { t } = useTranslation();
  const [exams, setExams] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState<any>(null);
  const [expandedExam, setExpandedExam] = useState<number | null>(null);
  const [examDetail, setExamDetail] = useState<any>(null);
  const [showQuestionForm, setShowQuestionForm] = useState<number | null>(null);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const [examsRes, coursesRes] = await Promise.all([
        adminApi.exams.getAll(),
        adminApi.courses.getAll({ limit: 100 }),
      ]);
      setExams(examsRes.data.exams || []);
      setCourses(coursesRes.data.courses || []);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExams(); }, [fetchExams]);

  const handleExamSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {};
    formData.forEach((v, k) => { data[k] = v; });
    try {
      if (editingExam) {
        await adminApi.exams.update(editingExam.id, data);
      } else {
        await adminApi.exams.create(data);
      }
      setShowForm(false);
      setEditingExam(null);
      fetchExams();
    } catch {}
  };

  const handleDeleteExam = async (id: number) => {
    if (!confirm(t('admin.delete_exam_confirm'))) return;
    try { await adminApi.exams.delete(id); fetchExams(); } catch {}
  };

  const toggleExpand = async (examId: number) => {
    if (expandedExam === examId) { setExpandedExam(null); setExamDetail(null); return; }
    try {
      const response = await adminApi.exams.getOne(examId);
      setExamDetail(response.data);
      setExpandedExam(examId);
    } catch {}
  };

  const handleQuestionSubmit = async (e: React.FormEvent<HTMLFormElement>, examId: number) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const optionsStr = formData.get('options') as string;
    let options;
    try { options = JSON.parse(optionsStr); } catch {
      alert(t('admin.invalid_options_format'));
      return;
    }
    try {
      await adminApi.exams.createQuestion(examId, {
        question: formData.get('question'),
        questionAr: formData.get('questionAr'),
        type: formData.get('type'),
        options,
        correctAnswer: formData.get('correctAnswer'),
        orderIndex: parseInt(formData.get('orderIndex') as string) || 0,
      });
      setShowQuestionForm(null);
      const response = await adminApi.exams.getOne(examId);
      setExamDetail(response.data);
    } catch {}
  };

  const handleDeleteQuestion = async (questionId: number, examId: number) => {
    if (!confirm(t('admin.delete_question_confirm'))) return;
    try {
      await adminApi.exams.deleteQuestion(questionId);
      const response = await adminApi.exams.getOne(examId);
      setExamDetail(response.data);
    } catch {}
  };

  return (
    <>
      <SEO title={t('seo.adminExams')} />
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.exams')}</h1>
          <button onClick={() => { setShowForm(!showForm); setEditingExam(null); }} className="btn-primary"><Plus className="w-4 h-4" /> {t('admin.add_exam')}</button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="card mb-6">
            <h2 className="text-lg font-semibold mb-4">{editingExam ? t('admin.edit_exam') : t('admin.new_exam')}</h2>
            <form onSubmit={handleExamSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.course')}</label>
                  <select name="courseId" className="input" defaultValue={editingExam?.courseId} required>
                    <option value="">{t('admin.select_course')}</option>
                    {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.duration_min')}</label><input type="number" name="duration" className="input" defaultValue={editingExam?.duration || 60} required /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.title_en_label')}</label><input type="text" name="title" className="input" defaultValue={editingExam?.title} required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.title_ar_label')}</label><input type="text" name="titleAr" className="input" defaultValue={editingExam?.titleAr} required /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.description_en')}</label><textarea name="description" className="input" rows={2} defaultValue={editingExam?.description} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.description_ar')}</label><textarea name="descriptionAr" className="input" rows={2} defaultValue={editingExam?.descriptionAr} /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.passing_score')}</label><input type="number" name="passingScore" className="input" defaultValue={editingExam?.passingScore || 50} min="0" max="100" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.max_attempts')}</label><input type="number" name="maxAttempts" className="input" defaultValue={editingExam?.maxAttempts || 3} min="1" /></div>
              </div>
              <div className="flex items-center gap-2"><input type="checkbox" name="isPublished" defaultChecked={editingExam?.isPublished ?? true} className="w-4 h-4" /><label className="text-sm">{t('common.published')}</label></div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary">{editingExam ? t('common.save') : t('common.create')}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingExam(null); }} className="btn-outline">{t('common.cancel')}</button>
              </div>
            </form>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
        ) : exams.length === 0 ? (
          <div className="text-center py-20"><Award className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">{t('common.noData')}</p></div>
        ) : (
          <div className="space-y-3">
            {exams.map((exam) => (
              <div key={exam.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => toggleExpand(exam.id)}>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"><Award className="w-5 h-5 text-primary" /></div>
                    <div>
                      <div className="font-medium text-gray-900">{exam.title}</div>
                      <div className="text-sm text-gray-500">{exam.titleAr} - {exam.course?.title || ''}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{exam.duration}min | {exam.passingScore}% | {exam.maxAttempts} {t('courses.tries')}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${exam.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {exam.isPublished ? t('common.published') : t('common.draft')}
                    </span>
                    <button onClick={() => { setEditingExam(exam); setShowForm(true); }} className="p-1 text-gray-400 hover:text-primary"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteExam(exam.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    <button onClick={() => toggleExpand(exam.id)} className="p-1 text-gray-400">
                      {expandedExam === exam.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {expandedExam === exam.id && examDetail && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{t('admin.questions')} ({examDetail.questions?.length || 0})</h3>
                      <button onClick={() => setShowQuestionForm(exam.id)} className="btn-primary text-sm py-1"><Plus className="w-3 h-3" /> {t('admin.add_question')}</button>
                    </div>

                    {showQuestionForm === exam.id && (
                      <form onSubmit={(e) => handleQuestionSubmit(e, exam.id)} className="bg-gray-50 rounded-lg p-4 mb-3 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" name="question" placeholder={t('admin.question_en')} className="input text-sm" required />
                          <input type="text" name="questionAr" placeholder={t('admin.question_ar')} className="input text-sm" required />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <select name="type" className="input text-sm">
                            <option value="mcq">MCQ</option>
                            <option value="true_false">True/False</option>
                          </select>
                          <input type="text" name="correctAnswer" placeholder={t('admin.correct_answer')} className="input text-sm" required />
                          <input type="number" name="orderIndex" placeholder={t('admin.order')} className="input text-sm" defaultValue={0} />
                        </div>
                        <textarea name="options" className="input text-sm font-mono" rows={3} placeholder='[{"id":"A","text":"Option 1","textAr":"خيار 1"},{"id":"B","text":"Option 2","textAr":"خيار 2"}]' required />
                        <div className="flex items-center gap-3">
                          <button type="submit" className="btn-primary text-sm py-1">{t('common.save')}</button>
                          <button type="button" onClick={() => setShowQuestionForm(null)} className="btn-outline text-sm py-1">{t('common.cancel')}</button>
                        </div>
                      </form>
                    )}

                    {examDetail.questions?.map((q: any) => (
                      <div key={q.id} className="flex items-center justify-between py-2 ml-4 text-sm border-b last:border-0">
                        <div>
                          <span className="font-medium text-gray-800">{q.orderIndex}. {q.question}</span>
                          <span className="text-gray-400 ml-2">({q.questionAr})</span>
                          <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded ml-2">{q.type}</span>
                          <span className="text-xs text-success ml-2">{t('admin.answer_label')} {q.correctAnswer}</span>
                        </div>
                        <button onClick={() => handleDeleteQuestion(q.id, exam.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
