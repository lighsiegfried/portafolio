import { LayoutDashboard, FileText, Package, Warehouse, Users, BarChart3 } from 'lucide-react';
import { userCan } from '../utils/permissions';

/**
 * Single source of truth for the Mini ERP navigation.
 * Consumed by the sidebar, the command palette and the header breadcrumb.
 *
 * `titleKey` is a key inside the `nav` namespace of the Mini ERP dictionary
 * (`i18n/erpTranslations.js`). Labels are resolved at render time through
 * `navTitle(te, titleKey)` so the nav follows the active language.
 *
 * `permission` (optional) gates a link behind the existing role matrix
 * (utils/permissions.js). Links without a permission are visible to every
 * authenticated user. Page-level routes remain reachable; this only controls
 * what we surface in the UI so users don't hit avoidable 403s.
 *
 * @typedef {{ titleKey: string, url: string, icon: Function, permission?: string }} NavItem
 */

/** @type {NavItem[]} */
export const NAV_ITEMS = [
  { titleKey: 'dashboard', url: '/mini-erp/dashboard', icon: LayoutDashboard },
  { titleKey: 'requisitions', url: '/mini-erp/requisitions', icon: FileText },
  { titleKey: 'products', url: '/mini-erp/products', icon: Package },
  { titleKey: 'inventory', url: '/mini-erp/inventory', icon: Warehouse, permission: 'viewInventory' },
  { titleKey: 'leads', url: '/mini-erp/leads', icon: Users, permission: 'viewLeads' },
  { titleKey: 'reports', url: '/mini-erp/reports', icon: BarChart3 },
];

/**
 * Nav items the given user is allowed to see.
 * @param {object|null} user
 * @returns {NavItem[]}
 */
export function getVisibleNavItems(user) {
  return NAV_ITEMS.filter((item) => !item.permission || userCan(user, item.permission));
}

/**
 * Resolve the current route to the dictionary key of its title
 * (for the header/breadcrumb).
 * @param {string} pathname
 * @returns {{ titleKey: string }}
 */
export function getPageMeta(pathname) {
  const item = NAV_ITEMS.find((i) => pathname === i.url || pathname.startsWith(`${i.url}/`));
  return { titleKey: item ? item.titleKey : 'fallbackTitle' };
}

/**
 * Localized label for a nav title key.
 * @param {object} te - the Mini ERP dictionary from `useErpTranslation()`
 * @param {string} titleKey
 * @returns {string}
 */
export function navTitle(te, titleKey) {
  const nav = te && te.nav ? te.nav : null;
  if (!nav) return 'Mini ERP';
  return nav[titleKey] || nav.fallbackTitle || 'Mini ERP';
}
