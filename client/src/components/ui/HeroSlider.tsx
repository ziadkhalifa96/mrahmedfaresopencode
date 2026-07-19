import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { heroSlidesApi } from '../../services';
import FloatingParticles from './FloatingParticles';

interface HeroSlide {
  id: number;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  ctaTextEn: string;
  ctaTextAr: string;
  ctaLink: string;
  bgGradient: string;
  imageUrl?: string;
}

const fallbackSlides: HeroSlide[] = [
  {
    id: 0,
    titleEn: 'Learn English with 28 Years of Experience',
    titleAr: 'اتعلم إنجليزي مع 28 سنة خبرة',
    subtitleEn: 'Join thousands of students who achieved their dreams',
    subtitleAr: 'انضم لآلاف الطلاب اللي حققوا أحلامهم',
    ctaTextEn: 'Start Learning Now',
    ctaTextAr: 'ابدأ التعلم الآن',
    ctaLink: '/courses',
    bgGradient: 'from-primary via-primary-dark to-blue-900',
  },
];

export default function HeroSlider() {
  const { lang = 'en' } = useParams<{ lang: string }>();
  const isAr = lang === 'ar';
  const [slides, setSlides] = useState<HeroSlide[]>(fallbackSlides);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    heroSlidesApi.getPublic().then((res) => {
      if (res.data.slides?.length > 0) setSlides(res.data.slides);
    }).catch(() => {});
  }, []);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current]!;

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient} text-white`}
        >
          <FloatingParticles count={30} />

          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
            <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8 border border-white/10"
              >
                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                <span className="text-sm font-medium">{isAr ? 'أكاديمية أ/احمد فارس' : 'Ahmed Fares Academy'}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6"
              >
                {isAr ? slide.titleAr : slide.titleEn}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed max-w-xl"
              >
                {isAr ? slide.subtitleAr : slide.subtitleEn}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to={`/${lang}${slide.ctaLink}`}
                  className="group inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl shadow-lg shadow-white/20 hover:shadow-xl hover:bg-gray-100 transition-all duration-300"
                >
                  {isAr ? slide.ctaTextAr : slide.ctaTextEn}
                  <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
      >
        {isAr ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
      >
        {isAr ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className={`h-2.5 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-8' : 'bg-white/40 w-2.5 hover:bg-white/60'}`}
          />
        ))}
      </div>
    </section>
  );
}
