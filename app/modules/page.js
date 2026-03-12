import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Package, Plus } from 'lucide-react';
import Link from 'next/link';

import ClientModulesTable from './ClientModulesTable';
import { api } from '@/services/api';

export default async function ModulesPage() {
  let rawData = [];

  try {
    const response = await api.get('/get-modules');
    
    // Process API response
    if (response && response.status === 'success' && Array.isArray(response.data)) {
      rawData = response.data;
    } else {
      console.warn("No modules data fetched, falling back cleanly.");
    }
  } catch (err) {
    console.error("Failed to load modules data:", err);
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Module Management</h1>
          <p className="text-muted-foreground mt-2 font-medium">Define high-level product modules across the system.</p>
        </div>
        <Link href="/modules/add-module">
          <Button className="mt-4 md:mt-0 gap-2">
            <Plus className="h-4 w-4" />
            Create Module
          </Button>
        </Link>
      </div>

      <Card 
        title="Active Modules" 
        description="Top-level functional subdivisions of your enterprise systems."
        icon={Package}
        headerVariant="gradient"
      >
        <ClientModulesTable data={rawData} />
      </Card>
    </AdminLayout>
  );
}
