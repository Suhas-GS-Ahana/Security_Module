import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ShieldCheck, Plus } from 'lucide-react';

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

  // Fallback demo data matching backend schema
  if (rawData.length === 0) {
    rawData = [
      { role_master_id: 1, role_name: "Admin" },
      { role_master_id: 2, role_name: "Branch-User" },
      { role_master_id: 3, role_name: "RO-User" },
      { role_master_id: 4, role_name: "Auditor" }
    ];
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Role Management</h1>
          <p className="text-muted-foreground mt-2 font-medium">Define hierarchical access controls globally.</p>
        </div>
        <Button className="mt-4 md:mt-0 gap-2">
          <Plus className="h-4 w-4" />
          Create Role
        </Button>
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
