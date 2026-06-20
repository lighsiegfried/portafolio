import { useLocation } from 'react-router-dom';
import { SidebarTrigger } from '@/mini-erp/components/ui/sidebar';
import { Separator } from '@/mini-erp/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/mini-erp/components/ui/breadcrumb';
import CommandPalette from './CommandPalette';
import UserMenu from './UserMenu';
import { getPageMeta } from '../../config/navigation';

export default function AppHeader() {
  const location = useLocation();
  const { title } = getPageMeta(location.pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden sm:block">
            <BreadcrumbLink href="/mini-erp/dashboard">Mini ERP</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden sm:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <CommandPalette />
        <UserMenu />
      </div>
    </header>
  );
}
