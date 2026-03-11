'use client';

import React from 'react';
import DataTable from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function ClientRolesTable({ data }) {
  const columns = [
    { 
      header: 'Role ID', 
      accessorKey: 'role_master_id', 
      sortable: true, 
      searchable: true,
      cell: (row) => <div className="text-slate-500 font-mono text-sm">#{row.role_master_id}</div>
    },
    { 
      header: 'Role Name', 
      accessorKey: 'role_name', 
      sortable: true, 
      searchable: true,
      cell: (row) => <div className="font-semibold text-slate-800 px-1">{row.role_name}</div>
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      sortable: false,
      searchable: false,
      cell: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-blue-600 h-8 hover:bg-blue-50">Edit Permissions</Button>
        </div>
      )
    }
  ];

  return (
    <DataTable 
      columns={columns} 
      data={data} 
      searchPlaceholder="Search roles..." 
      itemsPerPage={5} 
    />
  );
}
