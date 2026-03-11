'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { api } from '@/services/api';

export default function ClientRolesTable({ data }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(null);

  const handleDelete = async (roleId) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    
    setIsDeleting(roleId);
    try {
      const res = await api.delete(`/delete-role/${roleId}`);
      if (res && res.status === 'success') {
        // Refresh the current route to fetch new data from the Server component
        router.refresh();
      } else {
        alert('Failed to delete role.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting.');
    } finally {
      setIsDeleting(null);
    }
  };

  const columns = [
    // { 
    //   header: 'Role ID', 
    //   accessorKey: 'role_master_id', 
    //   sortable: true, 
    //   searchable: true,
    //   cell: (row) => <div className="text-slate-500 font-mono text-sm">#{row.role_master_id}</div>
    // },
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
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600 h-8 hover:bg-red-50 hover:text-red-700"
            onClick={() => handleDelete(row.role_master_id)}
            disabled={isDeleting === row.role_master_id}
          >
            {isDeleting === row.role_master_id ? 'Deleting...' : 'Delete'}
          </Button>
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
