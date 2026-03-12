'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ShieldCheck, FileText, ScrollText, Zap, Package } from 'lucide-react';
import { cn } from '@/utils';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'User Management', path: '/users', icon: Users },
    { name: 'Role Management', path: '/roles', icon: ShieldCheck },
    { name: 'Page Management', path: '/pages', icon: FileText },
    { name: 'Module Management', path: '/modules', icon: Package },
    { name: 'Logs', path: '/logs', icon: ScrollText },
  ];

  return (
    <aside className="w-64 bg-[#0a0f1c] text-slate-300 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-20 shadow-xl shadow-blue-900/10 border-r border-[#1e293b]">
      <div className="h-16 flex items-center px-6 border-b border-[#1e293b] shrink-0 bg-[#0a0f1c]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-blue-600">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">Security Module</h1>
        </div>
      </div>
      
      <div className="flex-1 py-8 overflow-y-auto w-full px-4 scrollbar-thin">
        <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500 pl-3">Main Navigation</div>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                    isActive 
                      ? "bg-blue-600/10 text-blue-400" 
                      : "text-slate-400 hover:text-slate-100 hover:bg-[#1e293b]/50"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-colors duration-200", 
                    isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-300"
                  )} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-6 border-t border-[#1e293b] bg-gradient-to-b from-transparent to-[#050810]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin Portal</p>
            <p className="text-xs text-slate-500 truncate">admin@reporting.co</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
