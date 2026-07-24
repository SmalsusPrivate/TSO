'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import ActionModal from '@/components/admin/ActionModal';
import AdminToolbar from '@/components/admin/AdminToolbar';
import { Plus, Edit2, Trash2, Loader2, Star, Eye, EyeOff } from 'lucide-react';
import MediaUpload from '@/components/admin/MediaUpload';
import { resolveMediaUrl } from '@/lib/utils';
import { useDataTable } from '@/hooks/useDataTable';
import { toast } from 'sonner';

const INITIAL_FORM = { 
  id: null, name: '', role: '', exp: '', past: '', color: '#007AFF',
  img: '', cert: '', bio: '', isActive: true, isFeatured: false
};

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const table = useDataTable({
    data: trainers,
    searchFields: ['name', 'role', 'exp', 'past'],
    initialSortKey: 'name',
    itemsPerPage: 10
  });

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trainers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setTrainers(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch trainers:', error);
      toast.error('Failed to fetch trainers');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const isEditing = !!formData.id;
    const url = isEditing 
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/trainers/${formData.id}` 
      : `${process.env.NEXT_PUBLIC_API_URL}/api/trainers`;
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
        toast.success(isEditing ? 'Trainer updated' : 'Trainer added');
        setIsFormOpen(false);
        fetchTrainers();
      } else {
        toast.error('Failed to save trainer');
      }
    } catch (error) {
      console.error('Failed to save trainer', error);
      toast.error('Error saving trainer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trainers/${formData.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        toast.success('Trainer deleted');
        setIsDeleteOpen(false);
        fetchTrainers();
      } else {
        toast.error('Failed to delete trainer');
      }
    } catch (error) {
      console.error('Failed to delete trainer', error);
      toast.error('Error deleting trainer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${table.selectedIds.length} trainers?`)) return;
    setIsBulkDeleting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trainers`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ids: table.selectedIds })
      });
      if (res.ok) {
        toast.success(`Deleted ${table.selectedIds.length} trainers`);
        setTrainers(prev => prev.filter(t => !table.selectedIds.includes(String(t.id))));
        table.clearSelection();
      } else {
        toast.error('Failed to delete trainers');
      }
    } catch (error) {
      toast.error('Error deleting trainers');
    }
    setIsBulkDeleting(false);
  };

  const toggleActive = async (trainer: any) => {
    const isCurrentlyActive = trainer.isActive !== false;
    const action = isCurrentlyActive ? 'Inactive' : 'Active';
    if (!window.confirm(`Are you sure you want to mark ${trainer.name} as ${action}?`)) return;

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trainers/${trainer.id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ ...trainer, isActive: !isCurrentlyActive })
      });
      if (res.ok) fetchTrainers();
    } catch (error) {
      console.error('Failed to toggle active state', error);
    }
  };

  const toggleFeatured = async (trainer: any) => {
    const isCurrentlyFeatured = !!trainer.isFeatured;
    
    if (!isCurrentlyFeatured) {
      const featuredCount = trainers.filter(t => t.isActive !== false && t.isFeatured).length;
      if (featuredCount >= 4) {
        alert("You can only feature a maximum of 4 trainers. Please un-feature one first.");
        return;
      }
    }

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trainers/${trainer.id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ ...trainer, isFeatured: !isCurrentlyFeatured })
      });
      if (res.ok) fetchTrainers();
    } catch (error) {
      console.error('Failed to toggle featured state', error);
    }
  };

  const openAdd = () => {
    setFormData(INITIAL_FORM);
    setIsFormOpen(true);
  };

  const openEdit = (trainer: any) => {
    setFormData(trainer);
    setIsFormOpen(true);
  };

  const openDelete = (trainer: any) => {
    setFormData(trainer);
    setIsDeleteOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Trainers</h1>
          <p className="text-sm font-light text-white/50">Manage the faculty members shown on the website.</p>
        </div>
        <button 
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
          style={{ background: '#007AFF', boxShadow: '0 6px 20px rgba(0,122,255,0.3)' }}
        >
          <Plus className="w-4 h-4" /> Add Trainer
        </button>
      </div>

      <AdminToolbar 
        search={table.search}
        onSearch={table.handleSearch}
        searchPlaceholder="Search trainers..."
        filterOptions={[{ label: 'Active', value: true as any }, { label: 'Inactive', value: false as any }]}
        filterValue={table.filterValue}
        onFilter={(val) => table.handleFilter('isActive', val === '' ? null : val === 'true')}
        filterPlaceholder="All Statuses"
        selectedCount={table.selectedIds.length}
        onBulkDelete={handleBulkDelete}
      />

      <DataTable 
        columns={[
          { key: 'name', label: 'Trainer', sortable: true },
          { key: 'role', label: 'Role', sortable: true },
          { key: 'exp', label: 'Experience', sortable: true },
          { key: 'past', label: 'Past Companies', sortable: true },
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
            <td colSpan={6} className="px-6 py-12 text-center text-white/50 text-sm">No trainers found.</td>
          </tr>
        )}
        {table.paginatedData.map((trainer) => (
          <tr key={trainer.id} className={`transition-colors group ${trainer.isActive !== false ? 'hover:bg-white/5' : 'opacity-60 hover:opacity-100 hover:bg-white/5'}`}>
            <td className="px-6 py-4">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#007AFF] focus:ring-[#007AFF] focus:ring-offset-0 cursor-pointer"
                checked={table.selectedIds.includes(String(trainer.id))}
                onChange={() => table.toggleSelectRow(String(trainer.id))}
              />
            </td>
            <td className="px-6 py-4 flex items-center gap-4">
              {trainer.img ? (
                <img src={resolveMediaUrl(trainer.img)} alt="" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/10" />
              )}
              <div>
                <div className="text-sm font-medium text-white flex items-center gap-2">
                  {trainer.name}
                  {trainer.isActive !== false && trainer.isFeatured && (
                    <Star className="w-3.5 h-3.5 text-[#FFCC00] fill-[#FFCC00]" />
                  )}
                  {trainer.isActive === false && (
                    <span className="text-[9px] bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded">INACTIVE</span>
                  )}
                </div>
                <div className="text-xs text-white/40 mt-1">{trainer.cert}</div>
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-white/70">{trainer.role}</td>
            <td className="px-6 py-4 text-sm text-white/70">{trainer.exp}</td>
            <td className="px-6 py-4 text-sm text-white/70">{trainer.past}</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                {trainer.isActive !== false && (
                  <button 
                    onClick={() => toggleFeatured(trainer)} 
                    title={trainer.isFeatured ? "Un-feature Trainer" : "Feature Trainer"}
                    className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center transition-colors ${trainer.isFeatured ? 'text-[#FFCC00] hover:bg-[#FFCC00]/20' : 'text-white/40 hover:text-[#FFCC00] hover:bg-white/10'}`}
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={() => toggleActive(trainer)} 
                  title={trainer.isActive !== false ? "Mark as Inactive" : "Mark as Active"}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {trainer.isActive !== false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(trainer)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#FF9F0A] hover:bg-[#FF9F0A] hover:text-white transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => openDelete(trainer)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#FF2D55] hover:bg-[#FF2D55] hover:text-white transition-colors">
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
        title={formData.id ? 'Edit Trainer' : 'Add New Trainer'}
      >
        <form id="trainer-form" onSubmit={handleSave} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Trainer Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-[#007AFF] outline-none" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Role</label>
              <input type="text" required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-[#007AFF] outline-none" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Experience</label>
              <input type="text" required value={formData.exp} onChange={(e) => setFormData({...formData, exp: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Past Companies</label>
              <input type="text" value={formData.past} onChange={(e) => setFormData({...formData, past: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none" />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Certification / Sub-text</label>
            <input type="text" value={formData.cert} onChange={(e) => setFormData({...formData, cert: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none" />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Bio</label>
            <textarea rows={3} value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none" />
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
              <MediaUpload 
                label="Profile Image" 
                value={formData.img} 
                onChange={(val) => setFormData({...formData, img: val as string})}
                accept="image/*"
              />
            </div>
          </div>

        </form>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
          <button onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button type="submit" form="trainer-form" disabled={submitting} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-50" style={{ background: '#007AFF' }}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Trainer'}
          </button>
        </div>
      </ActionModal>

      {/* Delete Confirmation Modal */}
      <ActionModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Trainer"
        onConfirm={handleDelete}
        confirmText="Yes, Delete Trainer"
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
