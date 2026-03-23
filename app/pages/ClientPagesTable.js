'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DataTable from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import { api } from '@/services/api';

export default function ClientPagesTable({ data }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(null);

  const handleDelete = async (pageId) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    
    setIsDeleting(pageId);
    try {
      const res = await api.delete(`/delete-page/${pageId}`);
      if (res && res.status === 'success') {
        // Refresh the current route to fetch new data from the Server component
        router.refresh();
      } else {
        alert('Failed to delete page.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting.');
    } finally {
      setIsDeleting(null);
    }
  };

  const columns = [
    { 
      header: 'Page Name', 
      accessorKey: 'page_name', 
      sortable: true, 
      searchable: true ,
      cell: (row) => <div className="font-semibold text-slate-800 px-1">{row.page_name || "N/A"}</div>
    },
    { 
      header: 'Route', 
      accessorKey: 'page_link', 
      sortable: true, 
      searchable: true,
      cell: (row) => (
        <code className="text-xs bg-slate-100 text-blue-600 px-2 py-1 rounded max-w-[200px] truncate block">
          {row.page_link}
        </code>
      )
    },
    // { 
    //   header: 'Status', 
    //   accessorKey: 'is_active', 
    //   sortable: true,
    //   searchable: false,
    //   sortValue: (row) => (row.is_active === false || row.is_deleted === true) ? 0 : 1,
    //   cell: (row) => {
    //     const isInactive = row.is_active === false || row.is_deleted === true;
    //     return isInactive ? (
    //       <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">Inactive</span>
    //     ) : (
    //       <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">Active</span>
    //     );
    //   }
    // },
    {
      header: 'Actions',
      accessorKey: 'actions',
      sortable: false,
      searchable: false,
      cell: (row) => (
        <div className="flex gap-2">
          <Link href={`/pages/edit-page/${row.page_master_id}`}>
            <Button variant="ghost" size="sm" className="text-blue-600 h-8 hover:bg-blue-50">Edit</Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600 h-8 hover:bg-red-50 hover:text-red-700"
            onClick={() => handleDelete(row.page_master_id)}
            disabled={isDeleting === row.page_master_id}
          >
            {isDeleting === row.page_master_id ? 'Deleting...' : 'Delete'}
          </Button>
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
