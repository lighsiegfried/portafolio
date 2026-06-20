import { Navigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/mini-erp/components/ui/sidebar';
import { Toaster } from '@/mini-erp/components/ui/sonner';
import AppSidebar from './layout/AppSidebar';
import AppHeader from './layout/AppHeader';
import { useAuth } from '../hooks/useAuth';

export default function MiniErpLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="mini-erp-root min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/mini-erp/login" replace />;
  }

  return (
    <SidebarProvider className="mini-erp-root">
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
