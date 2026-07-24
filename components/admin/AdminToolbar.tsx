import { Search, Trash2, Filter } from 'lucide-react';
import { ReactNode } from 'react';

interface AdminToolbarProps {
  // Search
  search?: string;
  onSearch?: (val: string) => void;
  searchPlaceholder?: string;

  // Filter
  filterOptions?: { label: string; value: string }[];
  filterValue?: string | null;
  onFilter?: (val: string) => void;
  filterPlaceholder?: string;

  // Bulk Actions
  selectedCount?: number;
  onBulkDelete?: () => void;

  // Custom Actions (e.g. "Add New", "Export CSV")
  actions?: ReactNode;
}

export default function AdminToolbar({
  search,
  onSearch,
  searchPlaceholder = 'Search...',
  filterOptions,
  filterValue,
  onFilter,
  filterPlaceholder = 'All',
  selectedCount = 0,
  onBulkDelete,
  actions
}: AdminToolbarProps) {
  
  const hasSelection = selectedCount > 0;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      
      {/* Left side: Search & Filter OR Bulk Actions */}
      <div className="flex-1 min-w-0">
        {hasSelection ? (
          <div className="flex items-center gap-4 py-2">
            <span className="text-[#007AFF] font-medium text-sm bg-[#007AFF]/10 px-3 py-1 rounded-full border border-[#007AFF]/20">
              {selectedCount} selected
            </span>
            {onBulkDelete && (
              <button 
                onClick={onBulkDelete}
                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            {onSearch !== undefined && (
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#007AFF]/50 transition-colors placeholder:text-white/30"
                />
              </div>
            )}
            
            {filterOptions && onFilter && (
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                <select
                  value={filterValue || ''}
                  onChange={(e) => onFilter(e.target.value)}
                  className="appearance-none bg-white/5 border border-white/10 rounded-lg pl-9 pr-8 py-2 text-sm text-white focus:outline-none focus:border-[#007AFF]/50 transition-colors cursor-pointer"
                >
                  <option value="" className="bg-[#1a1a1a]">{filterPlaceholder}</option>
                  {filterOptions.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-[#1a1a1a]">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right side: Custom Actions */}
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
