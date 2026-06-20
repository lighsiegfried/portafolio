import { ClipboardList, Package, Users } from 'lucide-react';
import { downloadRequisitions, downloadInventory, downloadLeads } from '../../services/reportsApi';

/**
 * Report catalog. Mirrors the server-side CSV exports in
 * `apps/backend/src/modules/reports/handler.js` — generation stays on the
 * backend; the frontend only triggers the download and surfaces metadata.
 *
 * `columns` lists the exact fields each CSV contains (must match the backend
 * `fields` arrays) so the UI can describe precisely what gets exported.
 */
export const REPORTS = [
  {
    key: 'requisitions',
    title: 'Requisiciones',
    description: 'Historial completo de solicitudes de compra con su estado y fechas.',
    permission: 'downloadRequisitionsCsv',
    filename: 'requisiciones.csv',
    icon: ClipboardList,
    accent: 'violet',
    download: downloadRequisitions,
    columns: ['id', 'number', 'title', 'status', 'createdAt', 'updatedAt'],
  },
  {
    key: 'inventory',
    title: 'Inventario',
    description: 'Catálogo de productos con stock actual, mínimo y precio.',
    permission: 'downloadInventoryCsv',
    filename: 'inventario.csv',
    icon: Package,
    accent: 'cyan',
    download: downloadInventory,
    columns: ['id', 'sku', 'name', 'category', 'stock', 'minStock', 'price'],
  },
  {
    key: 'leads',
    title: 'Leads',
    description: 'Clientes potenciales con datos de contacto, estado y fuente.',
    permission: 'downloadLeadsCsv',
    filename: 'leads.csv',
    icon: Users,
    accent: 'green',
    download: downloadLeads,
    columns: ['id', 'companyName', 'contactName', 'email', 'status', 'source'],
  },
];

export const REPORT_ACCENTS = {
  violet: 'bg-violet-500/15 text-violet-300',
  cyan: 'bg-cyan-500/15 text-cyan-300',
  green: 'bg-green-500/15 text-green-300',
};
