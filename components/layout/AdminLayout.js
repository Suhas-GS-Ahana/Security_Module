import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 min-h-screen transition-all duration-300 relative">
        <Navbar />
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
