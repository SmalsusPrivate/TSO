'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import ActionModal from '@/components/admin/ActionModal';
import { Edit2, Trash2, Plus, Loader2, Check, Minus } from 'lucide-react';

const INITIAL_FORM = { 
  id: null, label: '', tso: true, others: false, order: 0
};

export default function FeaturesPage() {
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/features`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setFeatures(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch features:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const isEditing = !!formData.id;
    const url = isEditing 
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/features/${formData.id}` 
      : `${process.env.NEXT_PUBLIC_API_URL}/api/features`;
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
        setIsFormOpen(false);
        fetchFeatures();
      }
    } catch (error) {
      console.error('Failed to save feature', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/features/${formData.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        setIsDeleteOpen(false);
        fetchFeatures();
      }
    } catch (error) {
      console.error('Failed to delete feature', error);
    } finally {
      setSubmitting(false);
    }
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

  // Custom Toggle Switch Component
  const Toggle = ({ checked, onChange, label }: { checked: boolean, onChange: (c: boolean) => void, label: string }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
      <span className="text-sm text-white/80">{label}</span>
      <button 
        type="button" 
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-[#30D158]' : 'bg-white/10'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Features Comparison</h1>
          <p className="text-sm font-light text-white/50">Manage the 'Why TSO?' comparison table.</p>
        </div>
        <button 
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
          style={{ background: '#007AFF', boxShadow: '0 6px 20px rgba(0,122,255,0.3)' }}
        >
          <Plus className="w-4 h-4" /> Add Feature
        </button>
      </div>

      <DataTable columns={['Order', 'Feature', 'TSO', 'Others', 'Actions']} loading={loading}>
        {features.length === 0 && !loading && (
          <tr>
            <td colSpan={5} className="px-6 py-12 text-center text-white/50 text-sm">No features found.</td>
          </tr>
        )}
        {features.map((item) => (
          <tr key={item.id} className="hover:bg-white/5 transition-colors group">
            <td className="px-6 py-4 text-sm text-white/50">#{item.order}</td>
            <td className="px-6 py-4">
              <div className="text-sm font-medium text-white">{item.label}</div>
            </td>
            <td className="px-6 py-4">
              {item.tso 
                ? <Check className="w-5 h-5 text-[#30D158]" /> 
                : <Minus className="w-5 h-5 text-white/20" />}
            </td>
            <td className="px-6 py-4">
              {item.others 
                ? <Check className="w-5 h-5 text-[#30D158]" /> 
                : <Minus className="w-5 h-5 text-white/20" />}
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
        title={formData.id ? 'Edit Feature' : 'Add New Feature'}
      >
        <form id="feature-form" onSubmit={handleSave} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          
          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Feature Name</label>
            <input type="text" required value={formData.label} onChange={(e) => setFormData({...formData, label: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-[#007AFF] outline-none" placeholder="e.g. Placement Support" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Toggle 
              label="TSO Has It" 
              checked={formData.tso} 
              onChange={(val) => setFormData({...formData, tso: val})} 
            />
            <Toggle 
              label="Others Have It" 
              checked={formData.others} 
              onChange={(val) => setFormData({...formData, others: val})} 
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Sort Order</label>
            <input type="number" required value={formData.order} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-[#007AFF] outline-none" />
            <p className="text-xs text-white/30 mt-1">Lower numbers appear first in the table.</p>
          </div>

        </form>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
          <button onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button type="submit" form="feature-form" disabled={submitting} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-50" style={{ background: '#007AFF' }}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Feature'}
          </button>
        </div>
      </ActionModal>

      {/* Delete Confirmation Modal */}
      <ActionModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Feature"
        onConfirm={handleDelete}
        confirmText="Yes, Delete"
        confirmColor="#FF2D55"
        loading={submitting}
      >
        <p>Are you sure you want to delete <strong>{formData.label}</strong>?</p>
        <p className="mt-2 text-white/40 text-xs">This action cannot be undone and it will be removed from the public website.</p>
      </ActionModal>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
