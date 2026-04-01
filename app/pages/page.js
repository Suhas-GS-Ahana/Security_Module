import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FileText, Plus } from 'lucide-react';
import Link from 'next/link';

import { serverApi as api } from '@/services/server-api';
import ClientPagesTable from './ClientPagesTable';

export default async function PagesPage() {
  let rawData = [];

  try {
    const response = await api.get('/get-pages');
    
    // Process API response
    if (response && response.status === 'success' && Array.isArray(response.data)) {
      rawData = response.data;
    } else {
      console.warn("No pages data fetched, falling back cleanly.");
    }
  } catch (err) {
    console.error("Failed to load pages data:", err);
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Page Management</h1>
          <p className="text-muted-foreground mt-2 font-medium">Restrict modular page route access controls.</p>
        </div>
        <Link href="/pages/add-page">
          <Button className="mt-4 md:mt-0 gap-2">
            <Plus className="h-4 w-4" />
            Register Page
          </Button>
        </Link>
      </div>

      <Card 
        title="Navigational Pages" 
        description="All routes tracked within the application context system."
        icon={FileText}
        headerVariant="gradient"
      >
        <ClientPagesTable data={rawData} />
      </Card>
    </AdminLayout>
  );
}
