import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Calendar, User, ArrowLeft, Loader2, BookOpen } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { Section, Container } from '../../components/ui/Section';
import { blogApi } from '../../services';
import type { BlogPost } from '../../types';
import { format } from 'date-fns';

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        const response = await blogApi.getBySlug(slug);
        setPost(response.data.post);
      } catch {
        // Post will be loaded when API is ready
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isArabic ? 'المقال غير موجود' : 'Post Not Found'}
          </h2>
          <Link to="/blog" className="text-primary hover:underline">
            {isArabic ? 'العودة للمدونة' : 'Back to Blog'}
          </Link>
        </div>
      </div>
    );
  }

  const title = isArabic ? post.titleAr : post.title;
  const content = isArabic ? post.contentAr : post.content;

  return (
    <>
      <SEO
        title={title}
        description={isArabic ? post.excerptAr : post.excerpt}
        image={post.thumbnail}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
              {isArabic ? 'العودة للمدونة' : 'Back to Blog'}
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{isArabic ? 'أحمد فares' : 'Ahmed Fares'}</span>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Content */}
      <Section>
        <Container>
          <div className="max-w-3xl mx-auto">
            {post.thumbnail && (
              <motion.img
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                src={post.thumbnail}
                alt={title}
                className="w-full aspect-video object-cover rounded-xl mb-8"
              />
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
