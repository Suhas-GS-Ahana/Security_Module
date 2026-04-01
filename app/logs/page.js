import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import { ScrollText } from 'lucide-react';
import { serverApi as api } from '@/services/server-api';
import ClientLogsTable from './ClientLogsTable';

export default async function LogsPage() {
  let tableData = [];

  try {
    const res = await api.get('/get-activity-logs');
    if (res && res.status === 'success' && Array.isArray(res.data)) {
      tableData = res.data;
    }
  } catch (err) {
    console.error('Failed to load activity logs:', err);
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Activity Logs</h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Immutable audit trail of all user login and session activity.
          </p>
        </div>
      </div>

      <Card
        title="Session Activity"
        description="Login attempts, session durations, and account lockout events."
        icon={ScrollText}
        headerVariant="gradient"
      >
        <ClientLogsTable data={tableData} />
      </Card>
    </AdminLayout>
  );
}
