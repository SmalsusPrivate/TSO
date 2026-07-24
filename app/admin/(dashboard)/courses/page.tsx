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
  id: null, no: '', name: '', tagline: '', dur: '', color: '#007AFF',
  description: '', img: '', video: '', accent: '#4da6ff', level: 'Beginner',
  category: 'Programming', topics: '', careers: '', highlights: '', stat_label: '', stat_val: ''
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const table = useDataTable({
    data: courses,
    searchFields: ['no', 'name', 'tagline', 'category', 'level'],
    initialSortKey: 'no',
    itemsPerPage: 10
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setCourses(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const isEditing = !!formData.id;
    const url = isEditing 
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${formData.id}` 
      : `${process.env.NEXT_PUBLIC_API_URL}/api/courses`;
    const method = isEditing ? 'PUT' : 'POST';

    const payload = {
      ...formData,
      topics: formData.topics ? (typeof formData.topics === 'string' ? formData.topics.split(',').map(s => s.trim()) : formData.topics) : [],
      careers: formData.careers ? (typeof formData.careers === 'string' ? formData.careers.split(',').map(s => s.trim()) : formData.careers) : [],
      highlights: formData.highlights ? (typeof formData.highlights === 'string' ? formData.highlights.split(',').map(s => s.trim()) : formData.highlights) : []
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
        toast.success(isEditing ? 'Course updated' : 'Course added');
        setIsFormOpen(false);
        fetchCourses();
      } else {
        toast.error('Failed to save course');
      }
    } catch (error) {
      console.error('Failed to save course', error);
      toast.error('Error saving course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${formData.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        toast.success('Course deleted');
        setIsDeleteOpen(false);
        fetchCourses();
      } else {
        toast.error('Failed to delete course');
      }
    } catch (error) {
      console.error('Failed to delete course', error);
      toast.error('Error deleting course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${table.selectedIds.length} courses?`)) return;
    setIsBulkDeleting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ids: table.selectedIds })
      });
      if (res.ok) {
        toast.success(`Deleted ${table.selectedIds.length} courses`);
        setCourses(prev => prev.filter(c => !table.selectedIds.includes(String(c.id))));
        table.clearSelection();
      } else {
        toast.error('Failed to delete courses');
      }
    } catch (error) {
      toast.error('Error deleting courses');
    }
    setIsBulkDeleting(false);
  };

  const openAdd = () => {
    setFormData(INITIAL_FORM);
    setIsFormOpen(true);
  };

  const openEdit = (course: any) => {
    setFormData({
      ...course,
      topics: Array.isArray(course.topics) ? course.topics.join(', ') : (course.topics || ''),
      careers: Array.isArray(course.careers) ? course.careers.join(', ') : (course.careers || ''),
      highlights: Array.isArray(course.highlights) ? course.highlights.join(', ') : (course.highlights || '')
    });
    setIsFormOpen(true);
  };

  const openDelete = (course: any) => {
    setFormData(course);
    setIsDeleteOpen(true);
  };

  const categories = Array.from(new Set(courses.map(c => c.category))).filter(Boolean).map(c => ({ label: c, value: c }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Courses</h1>
          <p className="text-sm font-light text-white/50">Manage the educational courses shown on the website.</p>
        </div>
        <button 
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
          style={{ background: '#007AFF', boxShadow: '0 6px 20px rgba(0,122,255,0.3)' }}
        >
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      <AdminToolbar 
        search={table.search}
        onSearch={table.handleSearch}
        searchPlaceholder="Search courses..."
        filterOptions={categories}
        filterValue={table.filterValue}
        onFilter={(val) => table.handleFilter('category', val)}
        filterPlaceholder="All Categories"
        selectedCount={table.selectedIds.length}
        onBulkDelete={handleBulkDelete}
      />

      <DataTable 
        columns={[
          { key: 'no', label: 'No.', sortable: true },
          { key: 'name', label: 'Course', sortable: true },
          { key: 'category', label: 'Category', sortable: true },
          { key: 'dur', label: 'Duration', sortable: true },
          'Actions'
        ]}
        loading={loading || isBulkDeleting}
        selectable={true}
        selectedIds={table.selectedIds}
        allIdsOnPage={table.paginatedData.map(c => String(c.id))}
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
            <td colSpan={6} className="px-6 py-12 text-center text-white/50 text-sm">No courses found.</td>
          </tr>
        )}
        {table.paginatedData.map((course) => (
          <tr key={course.id} className="hover:bg-white/5 transition-colors group">
            <td className="px-6 py-4">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#007AFF] focus:ring-[#007AFF] focus:ring-offset-0 cursor-pointer"
                checked={table.selectedIds.includes(String(course.id))}
                onChange={() => table.toggleSelectRow(String(course.id))}
              />
            </td>
            <td className="px-6 py-4 text-sm text-white/50">{course.no}</td>
            <td className="px-6 py-4 flex items-center gap-4">
              {course.img && <img src={resolveMediaUrl(course.img)} alt="" className="w-12 h-12 rounded-lg object-cover" />}
              <div>
                <div className="text-sm font-medium text-white">{course.name}</div>
                <div className="text-xs text-white/40 mt-1">{course.tagline}</div>
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-white/70">{course.category}</td>
            <td className="px-6 py-4 text-sm text-white/70">{course.dur}</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(course)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#FF9F0A] hover:bg-[#FF9F0A] hover:text-white transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => openDelete(course)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#FF2D55] hover:bg-[#FF2D55] hover:text-white transition-colors">
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
        title={formData.id ? 'Edit Course' : 'Add New Course'}
      >
        <form id="course-form" onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Course Number</label>
              <input type="text" required value={formData.no} onChange={(e) => setFormData({...formData, no: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-[#007AFF] outline-none" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Category</label>
              <input type="text" required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-[#007AFF] outline-none" />
            </div>
          </div>
          
          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Course Name</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-[#007AFF] outline-none" />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Tagline</label>
            <input type="text" required value={formData.tagline} onChange={(e) => setFormData({...formData, tagline: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-[#007AFF] outline-none" />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Detailed Description (Rich Text)</label>
            <RichTextEditor 
              value={formData.description} 
              onChange={(val) => setFormData({ ...formData, description: val })} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Theme Color (Hex)</label>
              <div className="flex gap-2">
                <input type="color" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-9 h-9 rounded bg-white/5 cursor-pointer" />
                <input type="text" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="flex-1 px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none" />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Accent Color (Hex)</label>
              <div className="flex gap-2">
                <input type="color" value={formData.accent} onChange={(e) => setFormData({...formData, accent: e.target.value})} className="w-9 h-9 rounded bg-white/5 cursor-pointer" />
                <input type="text" value={formData.accent} onChange={(e) => setFormData({...formData, accent: e.target.value})} className="flex-1 px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <MediaUpload 
                label="Cover Image" 
                value={formData.img} 
                onChange={(val) => setFormData({...formData, img: val as string})}
                accept="image/*"
              />
            </div>
            <div>
              <MediaUpload 
                label="Video Overview" 
                value={formData.video} 
                onChange={(val) => setFormData({...formData, video: val as string})}
                accept="video/*"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Duration</label>
              <input type="text" value={formData.dur} onChange={(e) => setFormData({...formData, dur: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Level</label>
              <input type="text" value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none" />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Topics (comma separated)</label>
            <input type="text" value={formData.topics} onChange={(e) => setFormData({...formData, topics: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none" placeholder="React, Node, Express" />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Careers (comma separated)</label>
            <input type="text" value={formData.careers} onChange={(e) => setFormData({...formData, careers: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none" />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Highlights (comma separated)</label>
            <input type="text" value={formData.highlights} onChange={(e) => setFormData({...formData, highlights: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Stat Label</label>
              <input type="text" value={formData.stat_label} onChange={(e) => setFormData({...formData, stat_label: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none" placeholder="e.g. Placement Rate" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Stat Value</label>
              <input type="text" value={formData.stat_val} onChange={(e) => setFormData({...formData, stat_val: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none" placeholder="e.g. 98%" />
            </div>
          </div>

        </form>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
          <button onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button type="submit" form="course-form" disabled={submitting} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-50" style={{ background: '#007AFF' }}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Course'}
          </button>
        </div>
      </ActionModal>

      {/* Delete Confirmation Modal */}
      <ActionModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Course"
        onConfirm={handleDelete}
        confirmText="Yes, Delete Course"
        confirmColor="#FF2D55"
        loading={submitting}
      >
        <p>Are you sure you want to delete <strong>{formData.name}</strong>?</p>
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
