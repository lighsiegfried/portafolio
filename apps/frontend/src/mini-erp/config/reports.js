import { ClipboardList, Package, Users } from 'lucide-react';
import { downloadRequisitions, downloadInventory, downloadLeads } from '../../services/reportsApi';
import { erpTranslations } from '../i18n/erpTranslations';

/**
 * Report catalog. Mirrors the server-side CSV exports in
 * `apps/backend/src/modules/reports/handler.js` — generation stays on the
 * backend; the frontend only triggers the download and surfaces metadata.
 *
 * `columns` lists the exact fields each CSV contains (must match the backend
 * `fields` arrays) so the UI can describe precisely what gets exported.
 *
 * i18n: `title` / `description` are keyed through `reports.catalog.<key>.*`.
 * The static fields hold the Spanish copy so untouched call sites keep working;
 * React call sites use `localizedReports(te)` (or `reportTitle(report, te)`)
 * with `te` from `useErpTranslation()`.
 */

/** Spanish dictionary slice used as the non-localized fallback. */
const FALLBACK = erpTranslations.es;

export const REPORTS = [
  {
    key: 'requisitions',
    title: FALLBACK.reports.catalog.requisitions.title,
    titleKey: 'reports.catalog.requisitions.title',
    description: FALLBACK.reports.catalog.requisitions.description,
    descriptionKey: 'reports.catalog.requisitions.description',
    permission: 'downloadRequisitionsCsv',
    filename: 'requisiciones.csv',
    icon: ClipboardList,
    accent: 'violet',
    download: downloadRequisitions,
    columns: ['id', 'number', 'title', 'status', 'createdAt', 'updatedAt'],
  },
  {
    key: 'inventory',
    title: FALLBACK.reports.catalog.inventory.title,
    titleKey: 'reports.catalog.inventory.title',
    description: FALLBACK.reports.catalog.inventory.description,
    descriptionKey: 'reports.catalog.inventory.description',
    permission: 'downloadInventoryCsv',
    filename: 'inventario.csv',
    icon: Package,
    accent: 'cyan',
    download: downloadInventory,
    columns: ['id', 'sku', 'name', 'category', 'stock', 'minStock', 'price'],
  },
  {
    key: 'leads',
    title: FALLBACK.reports.catalog.leads.title,
    titleKey: 'reports.catalog.leads.title',
    description: FALLBACK.reports.catalog.leads.description,
    descriptionKey: 'reports.catalog.leads.description',
    permission: 'downloadLeadsCsv',
    filename: 'leads.csv',
    icon: Users,
    accent: 'green',
    download: downloadLeads,
    columns: ['id', 'companyName', 'contactName', 'email', 'status', 'source'],
  },
];

/**
 * @param {{ key: string, title: string }} report
 * @param {object} [te] dictionary from `useErpTranslation()`
 */
export function reportTitle(report, te) {
  const dictionary = te || FALLBACK;
  return dictionary.reports?.catalog?.[report?.key]?.title || report?.title || report?.key;
}

/**
 * @param {{ key: string, description: string }} report
 * @param {object} [te]
 */
export function reportDescription(report, te) {
  const dictionary = te || FALLBACK;
  return dictionary.reports?.catalog?.[report?.key]?.description || report?.description || '';
}

/** `REPORTS` with `title` / `description` resolved for the active language. */
export function localizedReports(te) {
  return REPORTS.map((report) => ({
    ...report,
    title: reportTitle(report, te),
    description: reportDescription(report, te),
  }));
}

/** Icon chips: readable on both a white and a near-black surface. */
export const REPORT_ACCENTS = {
  violet: 'bg-violet-500/10 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  cyan: 'bg-cyan-500/10 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300',
  green: 'bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300',
};
