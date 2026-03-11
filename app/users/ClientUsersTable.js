'use client';

import React from 'react';
import DataTable from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function ClientUsersTable({ data }) {
  const columns = [
    { 
      header: 'Name', 
      accessorKey: 'name', 
      sortable: true, 
      searchable: true,
      cell: (row) => <div className="font-semibold text-slate-800">{row.name}</div>
    },
    { 
      header: 'Email', 
      accessorKey: 'email', 
      sortable: true, 
      searchable: true,
      cell: (row) => <div className="text-muted-foreground text-sm">{row.email}</div>
    },
    { 
      header: 'Role', 
      accessorKey: 'role', 
      sortable: true, 
      searchable: true,
      cell: (row) => (
        <Badge variant={row.role === 'Admin' ? 'purple' : 'secondary'}>
          {row.role}
        </Badge>
      )
    },
    { 
      header: 'Status', 
      accessorKey: 'status', 
      sortable: true,
      searchable: false,
      sortValue: (row) => row.status === 'Active' ? 1 : 0,
      cell: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'destructive'}>
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      sortable: false,
      searchable: false,
      cell: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-blue-600 h-8 hover:bg-blue-50">Edit</Button>
        </div>
      )
    }
  ];

  return (
    <DataTable 
      columns={columns} 
      data={data} 
      searchPlaceholder="Search users by name, email, or role..." 
      itemsPerPage={10} 
    />
  );
}
