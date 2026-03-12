'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DataTable from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import { api } from '@/services/api';

export default function ClientModulesTable({ data }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(null);

  const handleDelete = async (moduleId) => {
    if (!confirm('Are you sure you want to delete this module?')) return;
    
    setIsDeleting(moduleId);
    try {
      const res = await api.delete(`/delete-module/${moduleId}`);
      if (res && res.status === 'success') {
        router.refresh();
      } else {
        alert('Failed to delete module.');
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
    //   header: 'Module ID', 
    //   accessorKey: 'module_id', 
    //   sortable: true, 
    //   searchable: true,
    //   cell: (row) => <div className="text-slate-500 font-mono text-sm">#{row.module_id || row.id || "N/A"}</div>
    // },
    { 
      header: 'Module Name', 
      accessorKey: 'module_name', 
      sortable: true, 
      searchable: true,
      cell: (row) => <div className="font-semibold text-slate-800 px-1">{row.module_name || row.name || "N/A"}</div>
    },
    // { 
    //   header: 'Description', 
    //   accessorKey: 'description', 
    //   sortable: true, 
    //   searchable: true,
    //   cell: (row) => <div className="text-muted-foreground text-sm truncate max-w-[300px]">{row.description || "N/A"}</div>
    // },
    {
      header: 'Actions',
      accessorKey: 'actions',
      sortable: false,
      searchable: false,
      cell: (row) => {
        const id = row.module_id || row.id;
        return (
          <div className="flex gap-2">
            <Link href={`/modules/edit-module/${id}`}>
              <Button variant="ghost" size="sm" className="text-blue-600 h-8 hover:bg-blue-50">Edit</Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 h-8 hover:bg-red-50 hover:text-red-700"
              onClick={() => handleDelete(id)}
              disabled={isDeleting === id}
            >
              {isDeleting === id ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <DataTable 
      columns={columns} 
      data={data} 
      searchPlaceholder="Search modules..." 
      emptyMessage="No modules available."
      itemsPerPage={5} 
    />
  );
}
