'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import ActionModal from '@/components/admin/ActionModal';
import { Edit2, Loader2, Search, Plus } from 'lucide-react';
import MediaUpload from '@/components/admin/MediaUpload';

const INITIAL_FORM = { 
  id: '', title: '', value: ''
};

export default function ContentPage() {
  const [contentItems, setContentItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/content`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setContentItems(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const isEditing = !!formData.id;
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/content`, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          id: formData.id || undefined,
          title: formData.title,
          value: formData.value
        })
      });
      
      if (res.ok) {
        setIsFormOpen(false);
        fetchContent();
      }
    } catch (error) {
      console.error('Failed to save content', error);
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

  const filteredItems = contentItems.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.value?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isImageField = formData.title.toLowerCase().includes('img') || formData.title.toLowerCase().includes('image');

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Site Content</h1>
          <p className="text-sm font-light text-white/50">Manage text content displayed across the website.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search key or value..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:border-[#007AFF] outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <DataTable columns={['Key', 'Value', 'Actions']} loading={loading}>
        {filteredItems.length === 0 && !loading && (
          <tr>
            <td colSpan={3} className="px-6 py-12 text-center text-white/50 text-sm">No content found.</td>
          </tr>
        )}
        {filteredItems.map((item) => (
          <tr key={item.id} className="hover:bg-white/5 transition-colors group">
            <td className="px-6 py-4 text-sm font-medium text-white">{item.title}</td>
            <td className="px-6 py-4 text-sm text-white/70">
              <div className="line-clamp-2 max-w-xl">{item.value}</div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#FF9F0A] hover:bg-[#FF9F0A] hover:text-white transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      {/* Edit Modal */}
      <ActionModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={formData.id ? 'Edit Content' : 'Add Content'}
      >
        <form id="content-form" onSubmit={handleSave} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          
          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Key (Snake Case)</label>
            <input 
              type="text" 
              required
              readOnly={!!formData.id} 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. about_story_img"
              className={`w-full px-3 py-2 rounded-lg text-sm text-white ${formData.id ? 'bg-white/5 border border-white/5 text-white/50 cursor-not-allowed' : 'bg-white/5 border border-white/10 focus:border-[#007AFF]'} outline-none`} 
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Value</label>
            {isImageField ? (
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <MediaUpload 
                  label="Select Image" 
                  value={formData.value} 
                  onChange={(val) => setFormData({...formData, value: val as string})}
                  accept="image/*"
                />
              </div>
            ) : formData.value.length > 50 || formData.value.includes('\n') ? (
              <textarea rows={5} required value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-[#007AFF] outline-none" />
            ) : (
              <input type="text" required value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-[#007AFF] outline-none" />
            )}
          </div>

        </form>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
          <button onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button type="submit" form="content-form" disabled={submitting} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-50" style={{ background: '#007AFF' }}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Content'}
          </button>
        </div>
      </ActionModal>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
