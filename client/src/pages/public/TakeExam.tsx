import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle, XCircle, RotateCcw, Award, Loader2 } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { Container } from '../../components/ui/Section';
import { examsApi } from '../../services';

export default function TakeExam() {
  const { examId } = useParams<{ examId: string }>();
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const navigate = useNavigate();

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [attempt, setAttempt] = useState<any>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!examId) return;
    const fetchExam = async () => {
      try {
        const response = await examsApi.getExam(parseInt(examId));
        setExam(response.data.exam);
        setQuestions(response.data.questions);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [examId]);

  useEffect(() => {
    if (timeLeft <= 0 || !attempt || result) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, attempt, result]);

  const handleStart = async () => {
    if (!examId) return;
    try {
      const response = await examsApi.startAttempt(parseInt(examId));
      setAttempt(response.data.attempt);
      setTimeLeft(exam.duration * 60);
    } catch {}
  };

  const handleAnswer = (questionId: number, selectedOptionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOptionId }));
    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ((q) => q + 1), 300);
    }
  };

  const handleSubmit = async () => {
    if (!attempt || submitting) return;
    setSubmitting(true);
    try {
      const answerArray = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
        questionId: parseInt(questionId),
        selectedOptionId,
      }));
      const response = await examsApi.submitAttempt(attempt.id, answerArray);
      setResult(response.data);
      setTimeLeft(0);
    } catch {} finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{isArabic ? 'الامتحان غير موجود' : 'Exam not found'}</p>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Start screen
  if (!attempt) {
    return (
      <>
        <SEO title={isArabic ? exam.titleAr : exam.title} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Container>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto text-center card p-8">
              <Award className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{isArabic ? exam.titleAr : exam.title}</h1>
              {exam.description && <p className="text-gray-600 mb-6">{isArabic ? exam.descriptionAr : exam.description}</p>}
              <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-8">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {exam.duration} {isArabic ? 'دقيقة' : 'min'}</span>
                <span>{questions.length} {isArabic ? 'سؤال' : 'questions'}</span>
                <span>{exam.maxAttempts} {isArabic ? 'محاولات' : 'attempts'}</span>
              </div>
              <button onClick={handleStart} className="btn-primary text-lg px-8 py-3">
                {isArabic ? 'ابدأ الامتحان' : 'Start Exam'}
              </button>
            </motion.div>
          </Container>
        </div>
      </>
    );
  }

  // Result screen
  if (result) {
    return (
      <>
        <SEO title={isArabic ? 'نتيجة الامتحان' : 'Exam Result'} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Container>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center card p-8">
              {result.passed ? (
                <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
              ) : (
                <XCircle className="w-16 h-16 text-danger mx-auto mb-4" />
              )}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {result.passed ? (isArabic ? 'أحسنت! لقد نجحت' : 'Congratulations! You Passed') : (isArabic ? 'لم تنجح' : 'Not Passed')}
              </h1>
              <div className="text-5xl font-bold text-primary my-6">{result.score}%</div>
              <p className="text-gray-600 mb-2">{result.correct} / {result.total} {isArabic ? 'إجابة صحيحة' : 'correct answers'}</p>
              <p className="text-sm text-gray-500 mb-8">{isArabic ? 'الدرجة المطلوبة:' : 'Passing score:'} {exam.passingScore}%</p>
              <div className="flex justify-center gap-4">
                {!result.passed && (
                  <button onClick={() => { setAttempt(null); setResult(null); setAnswers({}); setCurrentQ(0); }} className="btn-primary">
                    <RotateCcw className="w-4 h-4" /> {isArabic ? 'إعادة المحاولة' : 'Retry'}
                  </button>
                )}
                <button onClick={() => navigate(-1)} className="btn-outline">{isArabic ? 'العودة' : 'Go Back'}</button>
              </div>
            </motion.div>
          </Container>
        </div>
      </>
    );
  }

  // Exam in progress
  const question = questions[currentQ];
  const qText = isArabic ? question.questionAr : question.question;
  const options = (question.options as any[]) || [];
  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <>
      <SEO title={isArabic ? exam.titleAr : exam.title} />
      <div className="min-h-screen bg-gray-50">
        {/* Timer bar */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {currentQ + 1} / {questions.length}
            </div>
            <div className={`flex items-center gap-1 font-mono font-bold ${timeLeft < 60 ? 'text-danger' : 'text-gray-900'}`}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="h-1 bg-gray-100">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <Container className="py-12">
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card p-8"
              >
                <div className="text-sm text-primary font-medium mb-3">
                  {isArabic ? 'سؤال' : 'Question'} {currentQ + 1}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">{qText}</h2>
                <div className="space-y-3">
                  {options.map((opt: any) => (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswer(question.id, opt.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        answers[question.id] === opt.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                          answers[question.id] === opt.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {opt.id}
                        </span>
                        <span>{isArabic ? opt.textAr : opt.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setCurrentQ((q) => Math.max(0, q - 1))}
                disabled={currentQ === 0}
                className="btn-outline"
              >
                {isArabic ? 'السابق' : 'Previous'}
              </button>

              <div className="flex gap-1.5">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQ(i)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i === currentQ ? 'bg-primary' : answers[questions[i].id] ? 'bg-primary/40' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              {currentQ === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-primary"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isArabic ? 'إرسال' : 'Submit'}
                </button>
              ) : (
                <button onClick={() => setCurrentQ((q) => q + 1)} className="btn-primary">
                  {isArabic ? 'التالي' : 'Next'}
                </button>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
