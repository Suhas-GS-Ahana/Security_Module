import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ShieldCheck, Plus } from 'lucide-react';
import Link from 'next/link';

import ClientRolesTable from './ClientRolesTable';

import { api } from '@/services/api';

export default async function RolesPage() {
  let rawData = [];

  try {
    const response = await api.get('/get-roles');
    
    // Process API response
    if (response && response.status === 'success' && Array.isArray(response.data)) {
      rawData = response.data;
    } else {
      console.warn("No roles data fetched, falling back cleanly.");
    }
  } catch (err) {
    console.error("Failed to load roles data:", err);
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Role Management</h1>
          <p className="text-muted-foreground mt-2 font-medium">Define hierarchical access controls globally.</p>
        </div>
        <Link href="/roles/add-role">
          <Button className="mt-4 md:mt-0 gap-2">
            <Plus className="h-4 w-4" />
            Create Role
          </Button>
        </Link>
      </div>

      <Card 
        title="Active Roles" 
        description="Existing definitions configured in the RBAC architecture."
        icon={ShieldCheck}
        headerVariant="gradient"
      >
        <ClientRolesTable data={rawData} />
      </Card>
    </AdminLayout>
  );
}
