'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import ActionModal from '@/components/admin/ActionModal';
import AdminToolbar from '@/components/admin/AdminToolbar';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import MediaUpload from '@/components/admin/MediaUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { resolveMediaUrl } from '@/lib/utils';
import { useDataTable } from '@/hooks/useDataTable';
import { toast } from 'sonner';

const INITIAL_FORM = {
  id: null, title: '', author: '', status: 'published', tags: '',
  excerpt: '', content: '', category: 'General', readTime: '', featured: false, color: '#007AFF', coverImage: ''
};

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const table = useDataTable({
    data: blogs,
    searchFields: ['title', 'author', 'category', 'tags'],
    initialSortKey: 'publishDate',
    itemsPerPage: 10
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const isEditing = !!formData.id;
    const url = isEditing
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${formData.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/blogs`;
    const method = isEditing ? 'PUT' : 'POST';

    const payload = {
      ...formData,
      tags: formData.tags ? (typeof formData.tags === 'string' ? formData.tags.split(',').map(s => s.trim()) : formData.tags) : []
    };

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(isEditing ? 'Blog updated' : 'Blog created');
        setIsFormOpen(false);
        fetchBlogs();
      } else {
        toast.error('Failed to save blog');
      }
    } catch (error) {
      console.error('Failed to save blog', error);
      toast.error('Error saving blog');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${formData.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success('Blog deleted');
        setIsDeleteOpen(false);
        fetchBlogs();
      } else {
        toast.error('Failed to delete blog');
      }
    } catch (error) {
      console.error('Failed to delete blog', error);
      toast.error('Error deleting blog');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${table.selectedIds.length} blogs?`)) return;
    setIsBulkDeleting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ids: table.selectedIds })
      });
      if (res.ok) {
        toast.success(`Deleted ${table.selectedIds.length} blogs`);
        setBlogs(prev => prev.filter(b => !table.selectedIds.includes(String(b.id))));
        table.clearSelection();
      } else {
        toast.error('Failed to delete blogs');
      }
    } catch (error) {
      toast.error('Error deleting blogs');
    }
    setIsBulkDeleting(false);
  };

  const openAdd = () => {
    setFormData(INITIAL_FORM);
    setIsFormOpen(true);
  };

  const openEdit = (blog: any) => {
    setFormData({
      ...blog,
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
      featured: blog.featured === 1 || blog.featured === true
    });
    setIsFormOpen(true);
  };

  const openDelete = (blog: any) => {
    setFormData(blog);
    setIsDeleteOpen(true);
  };

  const categories = Array.from(new Set(blogs.map(b => b.category))).filter(Boolean).map(c => ({ label: c, value: c }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Blogs & Articles</h1>
          <p className="text-sm font-light text-white/50">Publish and manage blog posts.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
          style={{ background: '#007AFF', boxShadow: '0 6px 20px rgba(0,122,255,0.3)' }}
        >
          <Plus className="w-4 h-4" /> Write Post
        </button>
      </div>

      <AdminToolbar 
        search={table.search}
        onSearch={table.handleSearch}
        searchPlaceholder="Search blogs..."
        filterOptions={categories}
        filterValue={table.filterValue}
        onFilter={(val) => table.handleFilter('category', val)}
        filterPlaceholder="All Categories"
        selectedCount={table.selectedIds.length}
        onBulkDelete={handleBulkDelete}
      />

      <DataTable 
        columns={[
          { key: 'title', label: 'Post', sortable: true },
          { key: 'category', label: 'Category', sortable: true },
          { key: 'status', label: 'Status', sortable: true },
          { key: 'publishDate', label: 'Date', sortable: true },
          'Actions'
        ]}
        loading={loading || isBulkDeleting}
        selectable={true}
        selectedIds={table.selectedIds}
        allIdsOnPage={table.paginatedData.map(b => String(b.id))}
        onSelectAll={table.toggleSelectAll}
        sortKey={table.sortKey}
        sortDir={table.sortDir}
        onSort={table.handleSort}
        currentPage={table.currentPage}
        totalPages={table.totalPages}
        onPageChange={table.setCurrentPage}
      >
        {table.paginatedData.length === 0 && !loading && (
          <tr>
            <td colSpan={6} className="px-6 py-12 text-center text-white/50 text-sm">No blogs found.</td>
          </tr>
        )}
        {table.paginatedData.map((blog) => (
          <tr key={blog.id} className="hover:bg-white/5 transition-colors group">
            <td className="px-6 py-4">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#007AFF] focus:ring-[#007AFF] focus:ring-offset-0 cursor-pointer"
                checked={table.selectedIds.includes(String(blog.id))}
                onChange={() => table.toggleSelectRow(String(blog.id))}
              />
            </td>
            <td className="px-6 py-4 flex items-center gap-4">
              {blog.coverImage && <img src={resolveMediaUrl(blog.coverImage)} alt="" className="w-16 h-10 rounded-lg object-cover" />}
              <div>
                <div className="text-sm font-medium text-white flex items-center gap-2">
                  {blog.title}
                  {(blog.featured === 1 || blog.featured === true) && <span className="text-[9px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded">FEATURED</span>}
                </div>
                <div className="text-xs text-white/40 mt-1">{blog.author}</div>
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-white/70">{blog.category}</td>
            <td className="px-6 py-4">
              <span className="px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider" style={{ background: blog.status === 'published' ? 'rgba(48,209,88,0.1)' : 'rgba(255,255,255,0.1)', color: blog.status === 'published' ? '#30D158' : '#fff' }}>
                {blog.status}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-white/50">
              {new Date(blog.publishDate).toLocaleDateString()}
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(blog)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#FF9F0A] hover:bg-[#FF9F0A] hover:text-white transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => openDelete(blog)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#FF2D55] hover:bg-[#FF2D55] hover:text-white transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      {/* Add / Edit Modal */}
      <ActionModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={formData.id ? 'Edit Blog Post' : 'New Blog Post'}
      >
        <form id="blog-form" onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">

          <div>
            <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1 block">Post Title</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-[#007AFF] outline-none" />
          </div>

          <div>
            <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1 block">Blog Content (Rich Text)</label>
            <RichTextEditor 
              value={formData.content} 
              onChange={(val) => setFormData({ ...formData, content: val })} 
            />
          </div>

          <div>
            <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1 block">Short Excerpt (Intro)</label>
            <textarea rows={2} value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-[#007AFF] outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1 block">Author</label>
              <input type="text" required value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1 block">Category</label>
              <input type="text" required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1 block">Read Time</label>
              <input type="text" value={formData.readTime} onChange={(e) => setFormData({ ...formData, readTime: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none" placeholder="e.g. 5 min" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1 block">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none appearance-none">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div>
            <MediaUpload 
              label="Cover Image" 
              value={formData.coverImage} 
              onChange={(val) => setFormData({...formData, coverImage: val as string})}
              accept="image/*"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1 block">Theme Color (Hex)</label>
              <div className="flex gap-2">
                <input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-9 h-9 rounded bg-white/5 cursor-pointer" />
                <input type="text" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="flex-1 px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none" />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-5">
              <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-5 h-5 accent-[#007AFF] bg-white/5" />
              <label htmlFor="featured" className="text-sm font-medium text-white cursor-pointer">Featured Post?</label>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1 block">Tags (comma separated)</label>
            <input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none" placeholder="e.g. AI, Python, Career" />
          </div>
        </form>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
          <button onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button type="submit" form="blog-form" disabled={submitting} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-50" style={{ background: '#007AFF' }}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Blog'}
          </button>
        </div>
      </ActionModal>

      {/* Delete Confirmation Modal */}
      <ActionModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Blog Post"
        onConfirm={handleDelete}
        confirmText="Yes, Delete Post"
        confirmColor="#FF2D55"
        loading={submitting}
      >
        <p>Are you sure you want to delete <strong>{formData.title}</strong>?</p>
        <p className="mt-2 text-white/40 text-xs">This action cannot be undone.</p>
      </ActionModal>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
