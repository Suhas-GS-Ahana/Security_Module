'use client';

import React from 'react';
import DataTable from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';

export default function ClientPagesTable({ data }) {
  const columns = [
    { 
      header: 'Page Name', 
      accessorKey: 'page_name', 
      sortable: true, 
      searchable: true 
    },
    { 
      header: 'Route Options', 
      accessorKey: 'page_link', 
      sortable: true, 
      searchable: true,
      cell: (row) => (
        <code className="text-xs bg-slate-100 text-blue-600 px-2 py-1 rounded max-w-[200px] truncate block">
          {row.page_link}
        </code>
      )
    },
    { 
      header: 'Status', 
      accessorKey: 'is_active', 
      sortable: true,
      searchable: false,
      sortValue: (row) => (row.is_active === false || row.is_deleted === true) ? 0 : 1,
      cell: (row) => {
        const isInactive = row.is_active === false || row.is_deleted === true;
        return isInactive ? (
          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">Inactive</span>
        ) : (
          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">Active</span>
        );
      }
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      sortable: false,
      searchable: false,
      cell: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-blue-600 h-8">Edit</Button>
        </div>
      )
    }
  ];

  return (
    <DataTable 
      columns={columns} 
      data={data} 
      searchPlaceholder="Search pages..." 
      itemsPerPage={5} 
    />
  );
}
