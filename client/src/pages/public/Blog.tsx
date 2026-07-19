import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight, Search, BookOpen, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router';
import SEO from '../../components/ui/SEO';
import { Section, Container } from '../../components/ui/Section';
import { blogApi } from '../../services';
import { localize } from '../../utils/localize';
import type { BlogPost } from '../../types';
import { format } from 'date-fns';

export default function Blog() {
  const { lang = 'en' } = useParams<{ lang: string }>();
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await blogApi.getAll(1, 20);
        setPosts(response.data.data || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const title = localize(post, 'title');
    return title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <SEO
        title={t('blog.hero_title')}
        description={t('blog.hero_subtitle')}
        keywords={t('seo.blog.keywords') || ''}
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
              {t('blog.hero_title')}
            </h1>
            <p className="text-lg text-white/80">
              {t('blog.hero_subtitle')}
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Search */}
      <Section className="bg-gray-50">
        <Container>
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('blog.search_placeholder')}
                className="input pl-12 text-lg py-3"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('blog.no_posts')}
              </h3>
              <p className="text-gray-600">
                {t('blog.no_posts_desc')}
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    to={`/${lang}/blog/${post.slug}`}
                    className="card block hover:shadow-lg transition-all duration-300 group overflow-hidden"
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-4 overflow-hidden">
                      {post.thumbnail ? (
                        <img
                          src={post.thumbnail}
                          alt={localize(post, 'title')}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl font-bold text-primary/20">AF</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{t('blog.author')}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {localize(post, 'title')}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {localize(post, 'excerpt') || localize(post, 'content')}
                    </p>
                    <div className="mt-4 text-sm text-primary font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      {t('blog.read_more')}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}