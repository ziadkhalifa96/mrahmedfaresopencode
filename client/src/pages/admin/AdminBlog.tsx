import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { FileText, Search, Plus, Trash2, Edit, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { adminApi } from '../../services';

export default function AdminBlog() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 10 };
      if (search) params.search = search;
      const response = await adminApi.blog.getAll(params);
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch {} finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      if (editingPost) {
        await adminApi.blog.update(editingPost.id, formData);
      } else {
        await adminApi.blog.create(formData);
      }
      setShowForm(false);
      setEditingPost(null);
      fetchPosts();
    } catch {}
  };

  const handleDelete = async (id: number) => {
    if (!confirm(isArabic ? 'هل تريد حذف هذا المقال؟' : 'Delete this post?')) return;
    try { await adminApi.blog.delete(id); fetchPosts(); } catch {}
  };

  return (
    <>
      <SEO title={isArabic ? 'المدونة' : 'Blog'} />
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.blog')}</h1>
          <button onClick={() => { setShowForm(!showForm); setEditingPost(null); }} className="btn-primary"><Plus className="w-4 h-4" /> {isArabic ? 'إضافة مقال' : 'New Post'}</button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="card mb-6">
            <h2 className="text-lg font-semibold mb-4">{editingPost ? (isArabic ? 'تعديل المقال' : 'Edit Post') : (isArabic ? 'مقال جديد' : 'New Post')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" name="title" defaultValue={editingPost?.title} className="input" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">العنوان بالعربي</label><input type="text" name="titleAr" defaultValue={editingPost?.titleAr} className="input" required /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Content</label><textarea name="content" defaultValue={editingPost?.content} className="input" rows={5} required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">المحتوى بالعربي</label><textarea name="contentAr" defaultValue={editingPost?.contentAr} className="input" rows={5} required /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label><textarea name="excerpt" defaultValue={editingPost?.excerpt} className="input" rows={2} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">المقتطف بالعربي</label><textarea name="excerptAr" defaultValue={editingPost?.excerptAr} className="input" rows={2} /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'الصورة المصغرة' : 'Thumbnail'}</label><input type="file" name="thumbnail" accept="image/*" className="input" /></div>
                <div className="flex items-center gap-2 mt-6"><input type="checkbox" name="isPublished" defaultChecked={editingPost?.isPublished ?? true} className="w-4 h-4" /><label className="text-sm">{isArabic ? 'منشور' : 'Published'}</label></div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary">{editingPost ? t('common.save') : (isArabic ? 'إنشاء' : 'Create')}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingPost(null); }} className="btn-outline">{t('common.cancel')}</button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder={t('common.search')} className="input pl-10" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20"><FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">{t('common.noData')}</p></div>
        ) : (
          <>
            <div className="space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{post.title}</div>
                      <div className="text-sm text-gray-500">{post.titleAr} - {isArabic ? 'بواسطة' : 'by'} {post.author?.name}</div>
                      <div className="text-xs text-gray-400 mt-1">{new Date(post.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${post.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {post.isPublished ? (isArabic ? 'منشور' : 'Published') : (isArabic ? 'مسودة' : 'Draft')}
                      </span>
                      <button onClick={() => { setEditingPost(post); setShowForm(true); }} className="p-1 text-gray-400 hover:text-primary"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(post.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
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
