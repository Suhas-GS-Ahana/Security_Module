import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import { Users, ShieldCheck, Activity, Key, LogIn, Server } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { title: "Total Users", value: "1,248", icon: Users, color: "text-blue-600", bg: "bg-blue-100", trend: "+12%" },
    { title: "Active Roles", value: "12", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-100", trend: "0%" },
    { title: "System Logs", value: "8,942", icon: Activity, color: "text-indigo-600", bg: "bg-indigo-100", trend: "+24%" },
    { title: "Failed Logins", value: "43", icon: Key, color: "text-rose-600", bg: "bg-rose-100", trend: "-5%" }
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2 font-medium">Global security snapshot and metrics.</p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 rounded-full border border-blue-200 bg-blue-50/50 text-blue-700 text-sm font-semibold flex items-center shadow-sm">
          <div className="h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
          Live Sync Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-3xl font-bold text-foreground mt-2 tracking-tight">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shadow-inner`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-6 flex items-center text-sm">
              <span className={`font-semibold ${stat.trend.startsWith('+') ? 'text-emerald-600' : stat.trend === '0%' ? 'text-slate-500' : 'text-rose-600'}`}>
                {stat.trend}
              </span>
              <span className="text-muted-foreground ml-2">from last month</span>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <Card 
            title="Recent Audit Events" 
            description="Latest security-relevant system activities."
            icon={Server}
            headerVariant="gradient"
           >
            <div className="space-y-6">
              {[
                { time: '2m ago', evt: 'Login Attempt', user: 'system_admin', status: 'Success', icon: LogIn, color: 'text-emerald-500' },
                { time: '14m ago', evt: 'Role Modified', user: 'manager_role', status: 'Success', icon: ShieldCheck, color: 'text-blue-500' },
                { time: '1h ago', evt: 'Permission Denied', user: 'guest_acc', status: 'Failed', icon: Key, color: 'text-rose-500' },
              ].map((log, j) => (
                <div key={j} className="flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full bg-slate-100 group-hover:bg-slate-200 transition-colors ${log.color}`}>
                      <log.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{log.evt}</p>
                      <p className="text-xs text-muted-foreground">Target: {log.user}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${log.status === 'Success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {log.status}
                    </p>
                    <p className="text-xs text-muted-foreground">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div>
          <Card
            title="System Health"
            description="Real-time security module status."
          >
             <div className="space-y-4">
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="font-medium">Authentication API</span>
                   <span className="text-emerald-600 font-semibold">99.9%</span>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-2">
                   <div className="bg-emerald-500 h-2 rounded-full" style={{width: '99%'}}></div>
                 </div>
               </div>
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="font-medium">RBAC Database</span>
                   <span className="text-blue-600 font-semibold">95%</span>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-2">
                   <div className="bg-blue-500 h-2 rounded-full" style={{width: '95%'}}></div>
                 </div>
               </div>
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="font-medium">Audit Pipeline</span>
                   <span className="text-amber-500 font-semibold">78%</span>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-2">
                   <div className="bg-amber-400 h-2 rounded-full" style={{width: '78%'}}></div>
                 </div>
               </div>
             </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
