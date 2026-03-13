import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Users, UserPlus } from 'lucide-react';
import Link from 'next/link';

import ClientUsersTable from './ClientUsersTable';
import { api } from '@/services/api';

export default async function UsersPage() {
  let tableData = [];

  try {
    const res = await api.get('/get-users');
    if (res && res.status === 'success' && Array.isArray(res.data)) {
      tableData = res.data;
    }
  } catch (err) {
    console.error("Failed to load users data:", err);
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-2 font-medium">Control user access and lifecycle.</p>
        </div>
        <Link href="/users/add-user">
          <Button className="mt-4 md:mt-0 gap-2">
            <UserPlus className="h-4 w-4" />
            Add New User
          </Button>
        </Link>
      </div>

      <Card 
        title="Directory" 
        description="List of all registered security module administrators and operators."
        icon={Users}
        headerVariant="gradient"
      >
        <ClientUsersTable data={tableData} />
      </Card>
    </AdminLayout>
  );
}
