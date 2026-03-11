import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ScrollText, Download } from 'lucide-react';

import ClientLogsTable from './ClientLogsTable';

export default async function LogsPage() {
  const tableData = [
    { timestamp: '2026-03-10 10:23', user: 'admin@reporting.co', action: 'LOGIN', resource: 'System', status: 'Success' },
    { timestamp: '2026-03-10 10:24', user: 'admin@reporting.co', action: 'PAGE_ACCESS', resource: '/dashboard', status: 'Success' },
    { timestamp: '2026-03-10 11:45', user: 'admin@reporting.co', action: 'ROLE_UPDATE', resource: 'Role[Department Manager]', status: 'Success' },
    { timestamp: '2026-03-10 12:08', user: 'unknown_ip_89x', action: 'LOGIN', resource: 'System', status: 'Failed' },
    { timestamp: '2026-03-10 12:10', user: 'j.smith@reporting.co', action: 'LOGIN', resource: 'System', status: 'Failed' },
    { timestamp: '2026-03-10 12:11', user: 'j.smith@reporting.co', action: 'LOGIN', resource: 'System', status: 'Success' },
    { timestamp: '2026-03-10 12:35', user: 'j.smith@reporting.co', action: 'PAGE_ACCESS', resource: '/reports/q3', status: 'Failed' },
    { timestamp: '2026-03-10 13:02', user: 'admin@reporting.co', action: 'SETTING_CHANGE', resource: 'System[OAuth Provider]', status: 'Success' },
    { timestamp: '2026-03-10 14:15', user: 'system_cron', action: 'DATA_SYNC', resource: 'Database:Reporting', status: 'Success' },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">System Logs</h1>
          <p className="text-muted-foreground mt-2 font-medium">Immutable audit trails of security operations.</p>
        </div>
        <Button variant="outline" className="mt-4 md:mt-0 gap-2 shadow-sm bg-card hover:bg-muted">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card 
        title="Audit Logs" 
        description="Recent operational and login security events tracked globally."
        icon={ScrollText}
        headerVariant="gradient"
      >
        <ClientLogsTable data={tableData} />
      </Card>
    </AdminLayout>
  );
}
