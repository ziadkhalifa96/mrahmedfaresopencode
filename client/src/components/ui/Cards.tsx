import { Link } from 'react-router';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
}

export function FeatureCard({ icon: Icon, title, description, index = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card text-center hover:shadow-lg transition-all duration-300 group"
    >
      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
        <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

interface StatCardProps {
  number: string;
  label: string;
  index?: number;
}

export function StatCard({ number, label, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{number}</div>
      <div className="text-gray-600">{label}</div>
    </motion.div>
  );
}

interface CourseCardProps {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  thumbnail?: string;
  price: number;
  isFree: boolean;
  slug: string;
}

export function CourseCard({ title, titleAr, description, descriptionAr, thumbnail, price, isFree, slug }: CourseCardProps) {
  const dir = document.documentElement.dir || 'ltr';
  const isArabic = dir === 'rtl';
  const displayTitle = isArabic ? titleAr : title;
  const displayDesc = isArabic ? descriptionAr : description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link
        to={`/courses/${slug}`}
        className="card block hover:shadow-lg transition-all duration-300 group overflow-hidden"
      >
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-4 overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={displayTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl font-bold text-primary/20">AF</span>
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {displayTitle}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{displayDesc}</p>
        <div className="flex items-center justify-between">
          <span className={`text-lg font-bold ${isFree ? 'text-success' : 'text-primary'}`}>
            {isFree ? (isArabic ? 'مجاني' : 'Free') : `${price} EGP`}
          </span>
          <span className="text-sm text-primary group-hover:translate-x-1 transition-transform">
            {isArabic ? 'عرض' : 'View'} →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  index?: number;
}

export function TestimonialCard({ name, role, content, rating, index = 0 }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card"
    >
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
      </div>
      <p className="text-gray-600 mb-4 leading-relaxed italic">"{content}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-primary font-semibold text-sm">{name.charAt(0)}</span>
        </div>
        <div>
          <div className="font-semibold text-gray-900 text-sm">{name}</div>
          <div className="text-gray-500 text-xs">{role}</div>
        </div>
      </div>
    </motion.div>
  );
}
