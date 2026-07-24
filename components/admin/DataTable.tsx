'use client';

import { ReactNode } from 'react';
import { Loader2, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

export type ColumnDef = string | { key: string; label: string; sortable?: boolean };

interface DataTableProps {
  columns: ColumnDef[];
  children: ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  
  // Selection
  selectable?: boolean;
  selectedIds?: string[];
  allIdsOnPage?: string[];
  onSelectAll?: () => void;

  // Sorting
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;

  // Pagination
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function DataTable({ 
  columns, 
  children, 
  loading, 
  emptyMessage = 'No data found',
  selectable,
  selectedIds = [],
  allIdsOnPage = [],
  onSelectAll,
  sortKey,
  sortDir,
  onSort,
  currentPage,
  totalPages,
  onPageChange
}: DataTableProps) {
  
  const allSelected = allIdsOnPage.length > 0 && allIdsOnPage.every(id => selectedIds.includes(id));
  const someSelected = selectedIds.length > 0 && !allSelected;

  return (
    <div className="w-full flex flex-col">
      <div className="w-full rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                {selectable && (
                  <th className="px-6 py-4 w-12">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#007AFF] focus:ring-[#007AFF] focus:ring-offset-0 cursor-pointer"
                      checked={allSelected}
                      ref={input => {
                        if (input) input.indeterminate = someSelected;
                      }}
                      onChange={onSelectAll}
                    />
                  </th>
                )}
                {columns.map((col, i) => {
                  const isString = typeof col === 'string';
                  const label = isString ? col : col.label;
                  const key = isString ? null : col.key;
                  const sortable = isString ? false : !!col.sortable;
                  const isSorted = sortable && sortKey === key;

                  return (
                    <th 
                      key={i} 
                      className={`px-6 py-4 text-[11px] font-semibold uppercase tracking-widest whitespace-nowrap transition-colors ${sortable ? 'cursor-pointer hover:text-white group' : 'text-white/40'}`}
                      onClick={() => sortable && onSort && key && onSort(key)}
                    >
                      <div className="flex items-center gap-2">
                        <span className={isSorted ? 'text-[#007AFF]' : (sortable ? 'text-white/40 group-hover:text-white/70' : 'text-white/40')}>
                          {label}
                        </span>
                        {sortable && (
                          <div className={`flex flex-col ${isSorted ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'}`}>
                            <ArrowUp className={`w-3 h-3 -mb-1 ${isSorted && sortDir === 'asc' ? 'text-[#007AFF]' : 'text-white/40'}`} />
                            <ArrowDown className={`w-3 h-3 ${isSorted && sortDir === 'desc' ? 'text-[#007AFF]' : 'text-white/40'}`} />
                          </div>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#007AFF] mx-auto" />
                  </td>
                </tr>
              ) : (
                children
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      {!loading && totalPages !== undefined && totalPages > 1 && currentPage !== undefined && onPageChange && (
        <div className="flex items-center justify-between px-2 mt-4">
          <div className="text-sm text-white/50">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
