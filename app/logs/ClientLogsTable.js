'use client';

import React from 'react';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import { LogIn, FileText, Shield, Settings, Server } from 'lucide-react';

export default function ClientLogsTable({ data }) {
  const getActionIcon = (action) => {
    switch (action) {
      case 'LOGIN': return <LogIn className="h-3.5 w-3.5 mr-1" />;
      case 'PAGE_ACCESS': return <FileText className="h-3.5 w-3.5 mr-1" />;
      case 'ROLE_UPDATE': return <Shield className="h-3.5 w-3.5 mr-1" />;
      case 'SETTING_CHANGE': return <Settings className="h-3.5 w-3.5 mr-1" />;
      default: return <Server className="h-3.5 w-3.5 mr-1" />;
    }
  };

  const columns = [
    { 
      header: 'Timestamp', 
      accessorKey: 'timestamp', 
      sortable: true, 
      searchable: true,
      cell: (row) => <div className="text-xs text-muted-foreground font-mono">{row.timestamp}</div>
    },
    { 
      header: 'Actor', 
      accessorKey: 'user', 
      sortable: true, 
      searchable: true,
      cell: (row) => <div className="text-sm font-medium">{row.user}</div>
    },
    { 
      header: 'Action', 
      accessorKey: 'action', 
      sortable: true, 
      searchable: true,
      cell: (row) => (
        <div className="flex items-center text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded max-w-fit">
          {getActionIcon(row.action)}
          {row.action}
        </div>
      )
    },
    { 
      header: 'Resource', 
      accessorKey: 'resource', 
      sortable: true, 
      searchable: true,
      cell: (row) => <div className="text-sm text-slate-600">{row.resource}</div>
    },
    { 
      header: 'Result', 
      accessorKey: 'status', 
      sortable: true,
      searchable: false,
      sortValue: (row) => row.status === 'Success' ? 1 : 0,
      cell: (row) => (
        <Badge variant={row.status === 'Success' ? 'success' : 'destructive'}>
          {row.status}
        </Badge>
      )
    }
  ];

  return (
    <DataTable 
      columns={columns} 
      data={data} 
      searchPlaceholder="Search logs by user, action, or resource..." 
      itemsPerPage={10} 
    />
  );
}
