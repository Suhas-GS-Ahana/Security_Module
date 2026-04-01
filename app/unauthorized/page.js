import React from 'react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#060c1a] flex flex-col items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-xl border border-red-500/20 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold border border-red-500/20">
          !
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-slate-400 mb-6 text-sm">
          You do not have the required permissions to access the Security Administration Module.
        </p>
        <a 
          href="/login" 
          className="inline-block bg-blue-600/90 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition shadow-lg shadow-blue-500/20"
        >
          Return to Login
        </a>
      </div>
    </div>
  );
}
