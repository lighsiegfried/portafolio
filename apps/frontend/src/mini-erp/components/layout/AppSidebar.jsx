import { Link, NavLink, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/mini-erp/components/ui/sidebar';
import { useAuth } from '../../hooks/useAuth';
import { getVisibleNavItems, navTitle } from '../../config/navigation';
import useErpTranslation from '../../i18n/useErpTranslation';

export default function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const { te } = useErpTranslation();
  const items = getVisibleNavItems(user);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="data-[state=open]:bg-sidebar-accent">
              <Link to="/mini-erp/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))]/15 text-[hsl(var(--primary-hover))] font-bold">
                  E
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold text-sidebar-foreground">{te.nav.brand}</span>
                  <span className="truncate text-xs text-muted-foreground">{te.nav.brandSubtitle}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{te.nav.groupManagement}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = location.pathname === item.url || location.pathname.startsWith(`${item.url}/`);
                const label = navTitle(te, item.titleKey);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={label}>
                      <NavLink to={item.url}>
                        <item.icon aria-hidden="true" />
                        <span>{label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={te.nav.backToPortfolio}>
              <Link to="/">
                <Home aria-hidden="true" />
                <span>{te.nav.backToPortfolio}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
