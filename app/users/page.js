import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Users, UserPlus } from 'lucide-react';

import ClientUsersTable from './ClientUsersTable';

export default async function UsersPage() {
  const tableData = [
    { name: 'John Doe', email: 'john.doe@reporting.co', role: 'Admin', status: 'Active' },
    { name: 'Jane Smith', email: 'jane.smith@reporting.co', role: 'Editor', status: 'Active' },
    { name: 'Michael Chen', email: 'm.chen@reporting.co', role: 'Viewer', status: 'Inactive' },
    { name: 'Sarah Jones', email: 'sarah.jones@reporting.co', role: 'Editor', status: 'Active' },
    { name: 'Robert Fox', email: 'robert.fox@reporting.co', role: 'Admin', status: 'Active' },
    { name: 'Eleanor Pena', email: 'eleanor.pena@reporting.co', role: 'Viewer', status: 'Active' },
    { name: 'Jenny Wilson', email: 'jenny.wilson@reporting.co', role: 'System', status: 'Inactive' },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-2 font-medium">Control user access and lifecycle.</p>
        </div>
        <Button className="mt-4 md:mt-0 gap-2">
          <UserPlus className="h-4 w-4" />
          Add New User
        </Button>
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
