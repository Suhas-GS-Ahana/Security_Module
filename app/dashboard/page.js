import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import { Users, ShieldCheck, FileText, Package, ArrowRight, Layout } from 'lucide-react';
import { api } from '@/services/api';

export default async function DashboardPage() {
  // Fetch all data in parallel — no hardcoded values
  const [usersRes, rolesRes, pagesRes, modulesRes] = await Promise.allSettled([
    api.get('/get-users'),
    api.get('/get-roles'),
    api.get('/get-pages'),
    api.get('/get-modules'),
  ]);

  const users   = usersRes.status   === 'fulfilled' && usersRes.value?.status   === 'success' ? usersRes.value.data   : [];
  const roles   = rolesRes.status   === 'fulfilled' && rolesRes.value?.status   === 'success' ? rolesRes.value.data   : [];
  const pages   = pagesRes.status   === 'fulfilled' && pagesRes.value?.status   === 'success' ? pagesRes.value.data   : [];
  const modules = modulesRes.status === 'fulfilled' && modulesRes.value?.status === 'success' ? modulesRes.value.data : [];

  const activeUsers   = users.filter(u => u.is_active).length;
  const inactiveUsers = users.length - activeUsers;

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      sub: `${activeUsers} active · ${inactiveUsers} inactive`,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      ring: 'ring-blue-100',
      href: '/users',
    },
    {
      title: 'Roles',
      value: roles.length,
      sub: 'Defined access roles',
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      ring: 'ring-emerald-100',
      href: '/roles',
    },
    {
      title: 'Registered Pages',
      value: pages.length,
      sub: 'Mapped application routes',
      icon: FileText,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      ring: 'ring-indigo-100',
      href: '/pages',
    },
    {
      title: 'Modules',
      value: modules.length,
      sub: 'Configured system modules',
      icon: Package,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      ring: 'ring-amber-100',
      href: '/modules',
    },
  ];

  const recentUsers = users.slice(-5).reverse();
  const recentPages = pages.slice(-5).reverse();
  const recentRoles = roles.slice(-5).reverse();

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2 font-medium">Live overview of your security module.</p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 rounded-full border border-blue-200 bg-blue-50/50 text-blue-700 text-sm font-semibold flex items-center shadow-sm">
          <div className="h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse" />
          Live Data
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href} className="block group">
              <div className={`bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ring-4 ${stat.ring} ring-opacity-0 group-hover:ring-opacity-100`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-3xl font-bold text-slate-800 tracking-tight">{stat.value}</p>
                <p className="text-sm font-medium text-slate-500 mt-1">{stat.title}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Lower grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Users */}
        <div className="lg:col-span-1">
          <Card title="Recent Users" description="Latest registered accounts." icon={Users} headerVariant="gradient">
            {recentUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No users found.</p>
            ) : (
              <ul className="divide-y divide-slate-100 -mx-1">
                {recentUsers.map((u) => (
                  <li key={u.user_master_id} className="flex items-center gap-3 py-3 px-1">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {(u.first_name?.[0] || u.user_name?.[0] || '?').toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{u.first_name} {u.last_name}</p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="pt-3 mt-1 border-t border-slate-100">
              <Link href="/users" className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                View all users <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Card>
        </div>

        {/* Recent Pages */}
        <div className="lg:col-span-1">
          <Card title="Recent Pages" description="Latest registered application routes." icon={Layout} headerVariant="gradient">
            {recentPages.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No pages found.</p>
            ) : (
              <ul className="divide-y divide-slate-100 -mx-1">
                {recentPages.map((p) => (
                  <li key={p.page_master_id ?? p.page_id ?? p.page_name} className="flex items-center gap-3 py-3 px-1">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {(p.page_name?.[0] || 'P').toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{p.page_name}</p>
                      <p className="text-xs text-slate-400 truncate">{p.page_link || p.route || '—'}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="pt-3 mt-1 border-t border-slate-100">
              <Link href="/pages" className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                View all pages <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Card>
        </div>

        {/* Recent Roles */}
        <div className="lg:col-span-1">
          <Card title="Recent Roles" description="Latest defined access roles." icon={ShieldCheck} headerVariant="gradient">
            {recentRoles.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No roles found.</p>
            ) : (
              <ul className="divide-y divide-slate-100 -mx-1">
                {recentRoles.map((r) => (
                  <li key={r.role_master_id} className="flex items-center gap-3 py-3 px-1">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {(r.role_name?.[0] || 'R').toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{r.role_name}</p>
                      {/* <p className="text-xs text-slate-400 truncate">{r.role_description || 'No description'}</p> */}
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.is_active !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {r.is_active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="pt-3 mt-1 border-t border-slate-100">
              <Link href="/roles" className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                View all roles <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Card>
        </div>

      </div>
    </AdminLayout>
  );
}
