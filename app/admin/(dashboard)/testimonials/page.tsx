'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import ActionModal from '@/components/admin/ActionModal';
import AdminToolbar from '@/components/admin/AdminToolbar';
import { Edit2, Trash2, Plus, Loader2, Star } from 'lucide-react';
import { useDataTable } from '@/hooks/useDataTable';
import { toast } from 'sonner';

const INITIAL_FORM = { 
  id: null, name: '', role: '', text: '', rating: 5
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const table = useDataTable({
    data: testimonials,
    searchFields: ['name', 'role', 'text'],
    initialSortKey: 'name',
    itemsPerPage: 10
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setTestimonials(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
      toast.error('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const isEditing = !!formData.id;
    const url = isEditing 
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${formData.id}` 
      : `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast.success(isEditing ? 'Testimonial updated' : 'Testimonial added');
        setIsFormOpen(false);
        fetchTestimonials();
      } else {
        toast.error('Failed to save testimonial');
      }
    } catch (error) {
      console.error('Failed to save testimonial', error);
      toast.error('Error saving testimonial');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${formData.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        toast.success('Testimonial deleted');
        setIsDeleteOpen(false);
        fetchTestimonials();
      } else {
        toast.error('Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Failed to delete testimonial', error);
      toast.error('Error deleting testimonial');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${table.selectedIds.length} testimonials?`)) return;
    setIsBulkDeleting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ids: table.selectedIds })
      });
      if (res.ok) {
        toast.success(`Deleted ${table.selectedIds.length} testimonials`);
        setTestimonials(prev => prev.filter(t => !table.selectedIds.includes(String(t.id))));
        table.clearSelection();
      } else {
        toast.error('Failed to delete testimonials');
      }
    } catch (error) {
      toast.error('Error deleting testimonials');
    }
    setIsBulkDeleting(false);
  };

  const openAdd = () => {
    setFormData(INITIAL_FORM);
    setIsFormOpen(true);
  };

  const openEdit = (item: any) => {
    setFormData(item);
    setIsFormOpen(true);
  };

  const openDelete = (item: any) => {
    setFormData(item);
    setIsDeleteOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Testimonials</h1>
          <p className="text-sm font-light text-white/50">Manage student voices shown on the main page.</p>
        </div>
        <button 
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
          style={{ background: '#007AFF', boxShadow: '0 6px 20px rgba(0,122,255,0.3)' }}
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <AdminToolbar 
        search={table.search}
        onSearch={table.handleSearch}
        searchPlaceholder="Search testimonials..."
        selectedCount={table.selectedIds.length}
        onBulkDelete={handleBulkDelete}
      />

      <DataTable 
        columns={[
          { key: 'name', label: 'Student', sortable: true },
          { key: 'role', label: 'Role', sortable: true },
          { key: 'rating', label: 'Rating', sortable: true },
          { key: 'text', label: 'Quote', sortable: false },
          'Actions'
        ]}
        loading={loading || isBulkDeleting}
        selectable={true}
        selectedIds={table.selectedIds}
        allIdsOnPage={table.paginatedData.map(t => String(t.id))}
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
            <td colSpan={6} className="px-6 py-12 text-center text-white/50 text-sm">No testimonials found.</td>
          </tr>
        )}
        {table.paginatedData.map((item) => (
          <tr key={item.id} className="hover:bg-white/5 transition-colors group">
            <td className="px-6 py-4">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#007AFF] focus:ring-[#007AFF] focus:ring-offset-0 cursor-pointer"
                checked={table.selectedIds.includes(String(item.id))}
                onChange={() => table.toggleSelectRow(String(item.id))}
              />
            </td>
            <td className="px-6 py-4">
              <div className="text-sm font-medium text-white">{item.name}</div>
            </td>
            <td className="px-6 py-4 text-sm text-white/70">{item.role}</td>
            <td className="px-6 py-4">
              <div className="flex gap-1 text-[#FF9F0A]">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-white/70 line-clamp-2 max-w-sm italic">"{item.text}"</div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#FF9F0A] hover:bg-[#FF9F0A] hover:text-white transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => openDelete(item)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#FF2D55] hover:bg-[#FF2D55] hover:text-white transition-colors">
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
        title={formData.id ? 'Edit Testimonial' : 'Add New Testimonial'}
      >
        <form id="testimonial-form" onSubmit={handleSave} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Student Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-[#007AFF] outline-none" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Role / Background</label>
              <input type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-[#007AFF] outline-none" placeholder="e.g. College Student" />
            </div>
          </div>
          
          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/40 mb-2 block">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({...formData, rating: star})}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-6 h-6 transition-colors ${star <= formData.rating ? 'fill-[#F5A623] text-[#F5A623]' : 'text-white/20'}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Testimonial Quote</label>
            <textarea rows={4} required value={formData.text} onChange={(e) => setFormData({...formData, text: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none" placeholder="The text content..." />
          </div>

        </form>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
          <button onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button type="submit" form="testimonial-form" disabled={submitting} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-50" style={{ background: '#007AFF' }}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Testimonial'}
          </button>
        </div>
      </ActionModal>

      {/* Delete Confirmation Modal */}
      <ActionModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Testimonial"
        onConfirm={handleDelete}
        confirmText="Yes, Delete Testimonial"
        confirmColor="#FF2D55"
        loading={submitting}
      >
        <p>Are you sure you want to delete this testimonial from <strong>{formData.name}</strong>?</p>
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
