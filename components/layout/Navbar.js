'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, Settings, LogOut, Loader2 } from 'lucide-react';
import { getSession } from '@/utils/session';

export default function Navbar() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = getSession();
    if (session) setUser(session);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      router.push('/login');
      router.refresh();
    }
  };

  const initials = user
    ? `${user.username?.[0] || user.email?.[0] || 'U'}`.toUpperCase()
    : 'A';

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-6 z-10 sticky top-0 shadow-sm transition-all duration-300 w-full">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden md:flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search security modules..." 
            className="w-full h-9 pl-9 pr-4 rounded-md border border-input bg-muted/40 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 pl-4 border-l border-border md:border-none">
        <button className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-white"></span>
        </button>
        <button className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Settings className="h-5 w-5" />
        </button>

        {/* User avatar */}
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold cursor-pointer border border-blue-200 mx-1 text-xs">
          {initials}
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="Logout"
          className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
