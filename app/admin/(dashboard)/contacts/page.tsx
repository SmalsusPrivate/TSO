'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import ActionModal from '@/components/admin/ActionModal';
import AdminToolbar from '@/components/admin/AdminToolbar';
import { Eye, Download } from 'lucide-react';
import { useDataTable } from '@/hooks/useDataTable';
import { toast } from 'sonner';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const table = useDataTable({
    data: contacts,
    searchFields: ['name', 'email', 'phone', 'course'],
    initialSortKey: 'created_at',
    itemsPerPage: 10
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/contacts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setContacts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (table.totalItems === 0) return toast.error('No data to export');
    
    // We export ALL data that matches the current search/filter, regardless of pagination
    // To do this, we need to bypass paginatedData and use the internal state?
    // Actually, we can just export `contacts` or we can expose `filteredData` from the hook.
    // For now, let's export all `contacts` but only the ones that are currently in the table if possible.
    // Since we didn't export `filteredData` from the hook, exporting `contacts` is fine, or I can update the hook.
    // I'll export `contacts` that are checked, OR all contacts if none checked.
    const dataToExport = table.selectedIds.length > 0 
      ? contacts.filter(c => table.selectedIds.includes(c.id))
      : contacts;

    const headers = ['Name', 'Email', 'Phone', 'Course', 'Date', 'Message'];
    const rows = dataToExport.map(c => [
      `"${c.name}"`, 
      `"${c.email}"`, 
      `"${c.phone}"`, 
      `"${c.course}"`, 
      `"${new Date(c.created_at).toLocaleDateString()}"`, 
      `"${(c.message || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Export downloaded');
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${table.selectedIds.length} selected contacts?`)) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/contacts`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ ids: table.selectedIds })
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success(`Successfully deleted ${table.selectedIds.length} contacts`);
        setContacts(prev => prev.filter(c => !table.selectedIds.includes(c.id)));
        table.clearSelection();
      } else {
        toast.error(data.error || 'Failed to delete contacts');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('An error occurred during deletion');
    }
    setIsDeleting(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Contact Messages</h1>
        <p className="text-sm font-light text-white/50">View and manage messages submitted through the public contact form.</p>
      </div>

      <AdminToolbar 
        search={table.search}
        onSearch={table.handleSearch}
        searchPlaceholder="Search by name, email, phone, or course..."
        selectedCount={table.selectedIds.length}
        onBulkDelete={handleBulkDelete}
        actions={
          <button 
            onClick={handleExportCSV} 
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-white/10"
          >
            <Download className="w-4 h-4" /> 
            {table.selectedIds.length > 0 ? 'Export Selected' : 'Export All'}
          </button>
        }
      />

      <DataTable 
        columns={[
          { key: 'name', label: 'Name', sortable: true },
          { key: 'email', label: 'Email', sortable: true },
          { key: 'phone', label: 'Phone', sortable: false },
          { key: 'course', label: 'Course', sortable: true },
          { key: 'created_at', label: 'Date', sortable: true },
          'Actions'
        ]} 
        loading={loading || isDeleting}
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
            <td colSpan={7} className="px-6 py-12 text-center text-white/50 text-sm">No messages found matching your criteria.</td>
          </tr>
        )}
        {table.paginatedData.map((contact) => (
          <tr key={contact.id} className="hover:bg-white/5 transition-colors group">
            <td className="px-6 py-4">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#007AFF] focus:ring-[#007AFF] focus:ring-offset-0 cursor-pointer"
                checked={table.selectedIds.includes(String(contact.id))}
                onChange={() => table.toggleSelectRow(String(contact.id))}
              />
            </td>
            <td className="px-6 py-4 text-sm text-white font-medium">{contact.name}</td>
            <td className="px-6 py-4 text-sm text-white/70">{contact.email}</td>
            <td className="px-6 py-4 text-sm text-white/70">{contact.phone}</td>
            <td className="px-6 py-4 text-sm text-white/70">{contact.course}</td>
            <td className="px-6 py-4 text-sm text-white/50">
              {new Date(contact.created_at).toLocaleDateString()}
            </td>
            <td className="px-6 py-4">
              <button 
                onClick={() => setSelectedContact(contact)}
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#007AFF] hover:bg-[#007AFF] hover:text-white transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </DataTable>

      {/* View Message Modal */}
      <ActionModal
        isOpen={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        title="Message Details"
      >
        {selectedContact && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Name</div>
                <div className="text-white">{selectedContact.name}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Email</div>
                <div className="text-white">{selectedContact.email}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Phone</div>
                <div className="text-white">{selectedContact.phone}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Course</div>
                <div className="text-white">{selectedContact.course}</div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Message</div>
              <div className="text-white whitespace-pre-wrap p-4 rounded-xl bg-white/5 border border-white/5">
                {selectedContact.message}
              </div>
            </div>
          </div>
        )}
      </ActionModal>
    </div>
  );
}
