import { Navigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/mini-erp/components/ui/sidebar';
import { Toaster } from '@/mini-erp/components/ui/sonner';
import AppSidebar from './layout/AppSidebar';
import AppHeader from './layout/AppHeader';
import { useAuth } from '../hooks/useAuth';
import useErpTranslation from '../i18n/useErpTranslation';
import { useFormatterLanguage } from '../utils/formatters';

export default function MiniErpLayout({ children }) {
  const { user, loading } = useAuth();
  const { te } = useErpTranslation();
  // Keeps Intl (dates / numbers / currency) on the active language for every
  // `utils/formatters` call site that does not pass one explicitly.
  useFormatterLanguage();

  if (loading) {
    return (
      <div className="mini-erp-root min-h-screen bg-background flex items-center justify-center">
        <div
          role="status"
          aria-label={te.common.loading}
          className="w-8 h-8 border-2 border-[hsl(var(--primary)/0.3)] border-t-[hsl(var(--primary))] rounded-full animate-spin"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/mini-erp/login" replace />;
  }

  return (
    <SidebarProvider className="mini-erp-root">
      <AppSidebar />
      <SidebarInset className="bg-transparent">
        <AppHeader />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
