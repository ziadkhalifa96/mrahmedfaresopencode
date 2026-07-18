import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Search, Trash2, Edit, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { adminApi } from '../../services';

export default function AdminUsers() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 15 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const response = await adminApi.users.getAll(params);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch {} finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async (id: number) => {
    if (!confirm(isArabic ? 'هل تريد حذف هذا المستخدم؟' : 'Delete this user?')) return;
    try {
      await adminApi.users.delete(id);
      fetchUsers();
    } catch {}
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await adminApi.users.update(selectedUser.id, {
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        role: formData.get('role') as 'admin' | 'student',
        isVerified: formData.get('isVerified') === 'on',
      });
      setEditing(false);
      setSelectedUser(null);
      fetchUsers();
    } catch {}
  };

  return (
    <>
      <SEO title={isArabic ? 'المستخدمين' : 'Users'} />
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('admin.users')}</h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={t('common.search')} className="input pl-10" />
          </div>
          <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }} className="input w-auto">
            <option value="">{isArabic ? 'جميع الأدوار' : 'All Roles'}</option>
            <option value="student">{isArabic ? 'طالب' : 'Student'}</option>
            <option value="admin">{isArabic ? 'مدير' : 'Admin'}</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
        ) : users.length === 0 ? (
          <div className="text-center py-20"><Users className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">{t('common.noData')}</p></div>
        ) : (
          <>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-gray-600">{isArabic ? 'الاسم' : 'Name'}</th>
                    <th className="pb-3 font-medium text-gray-600">{isArabic ? 'البريد' : 'Email'}</th>
                    <th className="pb-3 font-medium text-gray-600">{isArabic ? 'الهاتف' : 'Phone'}</th>
                    <th className="pb-3 font-medium text-gray-600">{isArabic ? 'الدور' : 'Role'}</th>
                    <th className="pb-3 font-medium text-gray-600">{isArabic ? 'الحالة' : 'Status'}</th>
                    <th className="pb-3 font-medium text-gray-600">{isArabic ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b last:border-0">
                      <td className="py-3 font-medium">{user.name}</td>
                      <td className="py-3 text-gray-600">{user.email}</td>
                      <td className="py-3 text-gray-600">{user.phone || '-'}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {user.role === 'admin' ? (isArabic ? 'مدير' : 'Admin') : (isArabic ? 'طالب' : 'Student')}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {user.isVerified ? (isArabic ? 'محقق' : 'Verified') : (isArabic ? 'غير محقق' : 'Unverified')}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setSelectedUser(user); setEditing(true); }} className="p-1 text-gray-400 hover:text-primary"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(user.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

        {editing && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setEditing(false); setSelectedUser(null); }}>
            <div className="bg-white rounded-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-semibold mb-4">{isArabic ? 'تعديل المستخدم' : 'Edit User'}</h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'الاسم' : 'Name'}</label>
                  <input type="text" name="name" defaultValue={selectedUser.name} className="input" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'الهاتف' : 'Phone'}</label>
                  <input type="tel" name="phone" defaultValue={selectedUser.phone} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isArabic ? 'الدور' : 'Role'}</label>
                  <select name="role" defaultValue={selectedUser.role} className="input">
                    <option value="student">{isArabic ? 'طالب' : 'Student'}</option>
                    <option value="admin">{isArabic ? 'مدير' : 'Admin'}</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="isVerified" defaultChecked={selectedUser.isVerified} className="w-4 h-4" />
                  <label className="text-sm">{isArabic ? 'محقق' : 'Verified'}</label>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary">{t('common.save')}</button>
                  <button type="button" onClick={() => { setEditing(false); setSelectedUser(null); }} className="btn-outline">{t('common.cancel')}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
