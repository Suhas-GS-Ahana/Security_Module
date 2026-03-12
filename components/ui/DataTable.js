'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils';
import Button from './Button';
import Input from './Input';

export default function DataTable({ 
  data = [], 
  columns = [], 
  searchable = true,
  searchPlaceholder = "Search...",
  emptyMessage = "No matching records found.",
  itemsPerPage = 5 
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const column = columns.find(c => c.accessorKey === sortConfig.key);
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];
      
      // Allow custom sort values
      if (column?.sortValue) {
        valA = column.sortValue(a);
        valB = column.sortValue(b);
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig, columns]);

  // Searching
  const filteredData = useMemo(() => {
    if (!searchQuery) return sortedData;
    const lowerQuery = searchQuery.toLowerCase();
    return sortedData.filter(item => {
      return columns.some(col => {
        if (!col.searchable) return false;
        const val = col.accessorKey ? item[col.accessorKey] : '';
        return String(val).toLowerCase().includes(lowerQuery);
      });
    });
  }, [sortedData, searchQuery, columns]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Reset to page 1 on search
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSort = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') setSortConfig({ key, direction: 'desc' });
      else setSortConfig({ key: null, direction: 'asc' });
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="flex items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card shadow-sm"
            />
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase py-3 outline-none">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="h-12 px-4 text-left align-middle font-medium"
                  >
                    {col.sortable ? (
                      <button
                        className="flex items-center gap-1.5 hover:text-foreground transition-colors outline-none cursor-pointer"
                        onClick={() => handleSort(col.accessorKey)}
                      >
                        {col.header}
                        {sortConfig.key === col.accessorKey ? (
                          sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4 text-blue-500" /> : <ChevronDown className="h-4 w-4 text-blue-500" />
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 opacity-30" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {paginatedData.length > 0 ? paginatedData.map((row, rowIndex) => (
                <tr 
                  key={rowIndex}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {columns.map((col, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="p-4 align-middle"
                    >
                      {col.cell ? col.cell(row) : row[col.accessorKey]}
                    </td>
                  ))}
                </tr>
              )) : (
                <tr>
                  <td colSpan={columns.length} className="p-8 text-center text-muted-foreground h-24">
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground font-medium">
          Showing <span className="text-foreground">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}</span> to <span className="text-foreground">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="text-foreground">{filteredData.length}</span> entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-semibold px-2">
            {currentPage} <span className="text-muted-foreground font-normal">/ {Math.max(1, totalPages)}</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
