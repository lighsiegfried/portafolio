import { Link, useLocation } from 'react-router-dom';
import { Home, Moon, Sun } from 'lucide-react';
import { SidebarTrigger } from '@/mini-erp/components/ui/sidebar';
import { Separator } from '@/mini-erp/components/ui/separator';
import { Button } from '@/mini-erp/components/ui/button';
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
import { getPageMeta, navTitle } from '../../config/navigation';
import useErpTranslation from '../../i18n/useErpTranslation';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';

export default function AppHeader() {
  const location = useLocation();
  const { te, language } = useErpTranslation();
  const { toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { titleKey } = getPageMeta(location.pathname);
  const title = navTitle(te, titleKey);

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-[hsl(var(--card)/0.72)] px-4 backdrop-blur-md supports-[backdrop-filter]:bg-[hsl(var(--card)/0.6)]">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-4" />
      <Breadcrumb className="min-w-0">
        <BreadcrumbList className="flex-nowrap">
          <BreadcrumbItem className="hidden sm:block">
            <BreadcrumbLink href="/mini-erp/dashboard">{te.nav.breadcrumbRoot}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden sm:block" />
          <BreadcrumbItem className="min-w-0">
            <BreadcrumbPage className="truncate">{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
        <CommandPalette />

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={te.common.toggleTheme}
          title={te.common.toggleTheme}
        >
          {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLanguage}
          aria-label={te.common.toggleLanguage}
          title={te.common.toggleLanguage}
        >
          <span aria-hidden="true" className="text-xs font-semibold uppercase">
            {language}
          </span>
        </Button>

        <Button asChild variant="ghost" className="h-9 gap-2 px-2 lg:px-3">
          <Link to="/" aria-label={te.common.backToPortfolio} title={te.common.backToPortfolio}>
            <Home aria-hidden="true" />
            <span className="hidden lg:inline">{te.common.backToPortfolio}</span>
          </Link>
        </Button>

        <UserMenu />
      </div>
    </header>
  );
}
