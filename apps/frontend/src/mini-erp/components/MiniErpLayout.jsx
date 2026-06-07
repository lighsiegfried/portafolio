import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import MiniErpSidebar from './MiniErpSidebar';
import MiniErpHeader from './MiniErpHeader';
import { useAuth } from '../hooks/useAuth';

export default function MiniErpLayout({ children }) {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/mini-erp/login" replace />;
  }

  return (
    <div className="min-h-screen bg-primary flex">
      <MiniErpSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <MiniErpHeader onMenuToggle={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
