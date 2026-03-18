'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DataTable from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { api } from '@/services/api';

export default function ClientUsersTable({ data }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(null);

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    setIsDeleting(userId);
    try {
      const res = await api.delete(`/delete-user/${userId}`);
      if (res && res.status === 'success') {
        router.refresh();
      } else {
        alert('Failed to delete user.');
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
      header: 'Name', 
      accessorKey: 'first_name', 
      sortable: true, 
      searchable: true,
      cell: (row) => <div className="font-semibold text-slate-800">{row.first_name} {row.last_name}</div>
    },
    { 
      header: 'Username', 
      accessorKey: 'user_name', 
      sortable: true, 
      searchable: true,
      cell: (row) => <div className="text-slate-600 text-sm">{row.user_name}</div>
    },
    { 
      header: 'Email', 
      accessorKey: 'email', 
      sortable: true, 
      searchable: true,
      cell: (row) => <div className="text-muted-foreground text-sm">{row.email}</div>
    },
    { 
      header: 'Status', 
      accessorKey: 'is_active', 
      sortable: true,
      searchable: false,
      sortValue: (row) => row.is_active ? 1 : 0,
      cell: (row) => (
        <Badge variant={row.is_active ? 'success' : 'destructive'}>
          {row.is_active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      sortable: false,
      searchable: false,
      cell: (row) => {
        const id = row.user_master_id;
        return (
          <div className="flex gap-2">
            <Link href={`/users/edit-user/${id}`}>
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
      searchPlaceholder="Search users by name, username, or email..." 
      emptyMessage="No users available."
      itemsPerPage={10} 
    />
  );
}
