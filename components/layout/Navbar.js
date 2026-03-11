import React from 'react';
import { Bell, Search, Settings } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-6 z-10 sticky top-0 shadow-sm transition-all duration-300 w-full">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden md:flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search security modules..." 
            className="w-full h-9 pl-9 pr-4 rounded-md border border-input bg-muted/40 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 pl-4 border-l border-border md:border-none">
        <button className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-white"></span>
        </button>
        <button className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Settings className="h-5 w-5" />
        </button>
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold cursor-pointer border border-blue-200 ml-2">
          A
        </div>
      </div>
    </header>
  );
}
