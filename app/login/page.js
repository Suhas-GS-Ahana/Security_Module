import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="max-w-md w-full z-10">
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 ring-1 ring-slate-200/50 overflow-hidden backdrop-blur-sm">
          <div className="p-10">
            <div className="flex justify-center mb-8">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">SecurityModule</h2>
              <p className="text-slate-500 mt-2 font-medium">Sign in to the Admin Portal</p>
            </div>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Work Email</label>
                <div className="relative">
                  <Input 
                    type="email" 
                    className="h-12 border-slate-200 focus-visible:ring-blue-500/50 bg-slate-50 focus-visible:bg-white" 
                    placeholder="admin@reporting.co"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-700">Password</label>
                  <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input 
                    type="password" 
                    className="h-12 border-slate-200 focus-visible:ring-blue-500/50 bg-slate-50 focus-visible:bg-white" 
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center pt-2">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer transition-colors" />
                <label htmlFor="remember-me" className="ml-3 block text-sm font-medium text-slate-600 cursor-pointer">
                  Remember this device
                </label>
              </div>

              <div className="pt-4">
                <button 
                  type="button" 
                  className="group w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md shadow-blue-500/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-[0.98]"
                >
                  Continuue to Dashboard
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
          
          <div className="py-4 px-10 bg-slate-50 border-t border-slate-100 flex justify-center">
            <p className="text-xs text-slate-500 font-medium tracking-wide">
              Enterprise Secure Authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
