import { LayoutDashboard, FileText, Package, Warehouse, Users, BarChart3 } from 'lucide-react';
import { userCan } from '../utils/permissions';

/**
 * Single source of truth for the Mini ERP navigation.
 * Consumed by the sidebar, the command palette and the header breadcrumb.
 *
 * `permission` (optional) gates a link behind the existing role matrix
 * (utils/permissions.js). Links without a permission are visible to every
 * authenticated user. Page-level routes remain reachable; this only controls
 * what we surface in the UI so users don't hit avoidable 403s.
 */
export const NAV_ITEMS = [
  { title: 'Dashboard', url: '/mini-erp/dashboard', icon: LayoutDashboard },
  { title: 'Requisiciones', url: '/mini-erp/requisitions', icon: FileText },
  { title: 'Productos', url: '/mini-erp/products', icon: Package },
  { title: 'Inventario', url: '/mini-erp/inventory', icon: Warehouse, permission: 'viewInventory' },
  { title: 'CRM Lite', url: '/mini-erp/leads', icon: Users, permission: 'viewLeads' },
  { title: 'Reportes', url: '/mini-erp/reports', icon: BarChart3 },
];

/** Nav items the given user is allowed to see. */
export function getVisibleNavItems(user) {
  return NAV_ITEMS.filter((item) => !item.permission || userCan(user, item.permission));
}

/** Resolve the current route to its title for the header/breadcrumb. */
export function getPageMeta(pathname) {
  const item = NAV_ITEMS.find((i) => pathname === i.url || pathname.startsWith(`${i.url}/`));
  return { title: item ? item.title : 'Mini ERP' };
}
