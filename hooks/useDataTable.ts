import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';

export interface UseDataTableOptions<T> {
  data: T[];
  searchFields?: string[];
  itemsPerPage?: number;
  initialSortKey?: string;
}

export function useDataTable<T extends { id?: string | number }>(options: UseDataTableOptions<T>) {
  const { data, searchFields = [], itemsPerPage = 10, initialSortKey } = options;
  
  const [search, setSearch] = useState('');
  const [filterKey, setFilterKey] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<any>(null);
  const [sortKey, setSortKey] = useState<string | undefined>(initialSortKey);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 1. Exact Filter (Dropdowns)
  const filteredData = useMemo(() => {
    if (!filterKey || filterValue === null || filterValue === '') return data;
    return data.filter(item => (item as any)[filterKey] === filterValue);
  }, [data, filterKey, filterValue]);

  // 2. Fuzzy Search
  const searchedData = useMemo(() => {
    if (!search || searchFields.length === 0) return filteredData;
    const fuse = new Fuse(filteredData, {
      keys: searchFields,
      threshold: 0.3,
    });
    return fuse.search(search).map(result => result.item);
  }, [filteredData, search, searchFields]);

  // 3. Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return searchedData;
    return [...searchedData].sort((a, b) => {
      const aVal = (a as any)[sortKey];
      const bVal = (b as any)[sortKey];
      if (aVal === bVal) return 0;
      
      const isAsc = sortDir === 'asc';
      if (aVal === null || aVal === undefined) return isAsc ? 1 : -1;
      if (bVal === null || bVal === undefined) return isAsc ? -1 : 1;
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return isAsc ? (aVal < bVal ? -1 : 1) : (aVal > bVal ? -1 : 1);
    });
  }, [searchedData, sortKey, sortDir]);

  // 4. Paginate
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setCurrentPage(1); // Reset page on sort
  };

  const handleSearch = (query: string) => {
    setSearch(query);
    setCurrentPage(1); // Reset page on search
  };

  const handleFilter = (key: string, value: any) => {
    setFilterKey(key);
    setFilterValue(value);
    setCurrentPage(1);
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const currentPageIds = paginatedData.map(item => String(item.id)).filter(id => id !== 'undefined');
    const allSelected = currentPageIds.every(id => selectedIds.includes(id));
    
    if (allSelected) {
      // Deselect all on current page
      setSelectedIds(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      // Select all on current page
      setSelectedIds(prev => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  const clearSelection = () => setSelectedIds([]);

  return {
    search,
    handleSearch,
    filterKey,
    filterValue,
    handleFilter,
    sortKey,
    sortDir,
    handleSort,
    currentPage,
    totalPages,
    setCurrentPage,
    selectedIds,
    toggleSelectRow,
    toggleSelectAll,
    clearSelection,
    paginatedData,
    totalItems: sortedData.length
  };
}
