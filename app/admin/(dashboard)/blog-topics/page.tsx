'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';
import AdminToolbar from '@/components/admin/AdminToolbar';
import DataTable from '@/components/admin/DataTable';
import ActionModal from '@/components/admin/ActionModal';
import { toast } from 'sonner';

export default function BlogTopicsPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({ id: '', title: '', status: 'Pending' });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/blog-topics`);
      const data = await res.json();
      if (data.status === 'success') {
        setTopics(data.data || []);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load blog topics');
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setFormData({ id: '', title: '', status: 'Pending' });
    setIsFormOpen(true);
  };

  const openEdit = (topic: any) => {
    setFormData({ id: topic.id, title: topic.title, status: topic.status });
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const isEditing = !!formData.id;
    const url = isEditing
      ? `${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/blog-topics/${formData.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/blog-topics`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title, status: formData.status })
      });

      if (res.ok) {
        toast.success(isEditing ? 'Topic updated' : 'Topic added');
        setIsFormOpen(false);
        fetchTopics();
      } else {
        toast.error('Failed to save topic');
      }
    } catch (error) {
      toast.error('Error saving topic');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/blog-topics/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Topic deleted');
        fetchTopics();
      } else {
        toast.error('Failed to delete topic');
      }
    } catch (error) {
      toast.error('Error deleting topic');
    } finally {
      setDeleteId(null);
    }
  };

  const filteredTopics = topics.filter(t => t.title?.toLowerCase().includes(search.toLowerCase()));

  const columns = ['Keyword / Topic', 'Status', 'Date Added', 'Actions'];

  return (
    <div className="space-y-6">
      <AdminToolbar 
        searchPlaceholder="Search topics..."
        search={search}
        onSearch={setSearch}
        actions={
          <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #007AFF, #0055CC)', boxShadow: '0 4px 15px rgba(0,122,255,0.3)' }}>
            <Plus className="w-4 h-4" /> Add Topic
          </button>
        }
      />

      <DataTable columns={columns} loading={loading}>
        {filteredTopics.length === 0 && !loading && (
          <tr>
            <td colSpan={4} className="px-6 py-12 text-center text-white/40 text-sm">
              No topics found.
            </td>
          </tr>
        )}
        {filteredTopics.map((row) => (
          <tr key={row.id} className="hover:bg-white/5 transition-colors group">
            <td className="px-6 py-4">
              <span className="font-semibold text-white/90">{row.title}</span>
            </td>
            <td className="px-6 py-4">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${row.status === 'Used' ? 'bg-[#34C759]/20 text-[#34C759] border border-[#34C759]/30' : 'bg-[#FF9F0A]/20 text-[#FF9F0A] border border-[#FF9F0A]/30'}`}>
                {row.status}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-white/40 text-sm">
                {new Date(row.createdAt).toLocaleDateString()}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex gap-2">
                <button onClick={() => openEdit(row)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-[#007AFF] transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteId(row.id)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-[#FF2D55] transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      {/* Add/Edit Modal */}
      <ActionModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={formData.id ? 'Edit Topic' : 'New Topic'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1 block">Topic / Keyword</label>
            <input 
              required
              type="text" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              className="w-full px-4 py-3 rounded-xl text-sm text-white bg-[#0a0a0f] border border-white/10 outline-none focus:border-[#007AFF] transition-colors" 
              placeholder="e.g. Why Learn React in 2026?" 
            />
          </div>
          <div>
            <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1 block">Status</label>
            <select 
              value={formData.status} 
              onChange={(e) => setFormData({ ...formData, status: e.target.value })} 
              className="w-full px-4 py-3 rounded-xl text-sm text-white bg-[#0a0a0f] border border-white/10 outline-none focus:border-[#007AFF] transition-colors appearance-none"
            >
              <option value="Pending">Pending (Waiting to be generated)</option>
              <option value="Used">Used (Already generated)</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-50" style={{ background: '#007AFF' }}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (formData.id ? 'Save Changes' : 'Add Topic')}
            </button>
          </div>
        </form>
      </ActionModal>

      {/* Delete Confirmation */}
      <ActionModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Topic?"
      >
        <p className="text-sm text-white/60 mb-6">Are you sure you want to delete this topic? It will be permanently removed from the generation queue.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button onClick={handleDelete} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90" style={{ background: '#FF2D55' }}>
            Delete Topic
          </button>
        </div>
      </ActionModal>
    </div>
  );
}
