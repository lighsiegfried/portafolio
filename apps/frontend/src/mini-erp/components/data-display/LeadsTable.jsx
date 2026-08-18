import { useMemo } from 'react';
import { MoreHorizontal, Eye } from 'lucide-react';
import { Button } from '@/mini-erp/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/mini-erp/components/ui/dropdown-menu';
import StatusBadge from '../StatusBadge';
import DataTable from './DataTable';
import { LEAD_STAGES, leadCompany, leadContact, sourceLabel } from '../../config/leads';
import { formatCurrency, formatDate } from '../../utils/formatters';
import useErpTranslation from '../../i18n/useErpTranslation';

/** Enhanced table view of leads (reuses the shared DataTable). */
export default function LeadsTable({ leads, canManage, onOpen, onMove }) {
  const { te } = useErpTranslation();
  const dash = te.formats.emptyValue;

  const columns = useMemo(() => [
    { id: 'company', accessorFn: (l) => leadCompany(l), header: te.leads.table.company, cell: ({ row }) => <span className="font-medium text-foreground">{leadCompany(row.original)}</span> },
    { id: 'contact', accessorFn: (l) => leadContact(l), header: te.leads.table.contact, cell: ({ row }) => <span className="text-muted-foreground">{leadContact(row.original)}</span> },
    { accessorKey: 'email', header: te.leads.table.email, cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.email || dash}</span> },
    { accessorKey: 'status', header: te.leads.table.status, cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'source', header: te.leads.table.source, cell: ({ row }) => <span className="text-xs text-muted-foreground">{te.leads.sources[row.original.source] || sourceLabel(row.original.source)}</span> },
    {
      accessorKey: 'estimatedValue',
      header: te.leads.table.value,
      meta: { className: 'text-right' },
      cell: ({ row }) => <span className="tabular-nums">{row.original.estimatedValue != null ? formatCurrency(row.original.estimatedValue) : dash}</span>,
    },
    {
      accessorKey: 'nextFollowUp',
      header: te.leads.table.followUp,
      meta: { className: 'text-right' },
      cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.nextFollowUp ? formatDate(row.original.nextFollowUp) : dash}</span>,
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      meta: { className: 'text-right' },
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8" aria-label={te.common.actions}>
                <MoreHorizontal className="size-4" aria-hidden="true" />
                <span className="sr-only">{te.common.actions}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onOpen(lead)}>
                <Eye className="size-4" aria-hidden="true" />
                {te.leads.table.viewDetail}
              </DropdownMenuItem>
              {canManage && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>{te.common.moveTo}</DropdownMenuLabel>
                  {LEAD_STAGES.filter((s) => s.status !== lead.status).map((s) => (
                    <DropdownMenuItem key={s.status} onClick={() => onMove(lead, s.status)}>
                      {te.status.lead[s.status] || s.label}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [canManage, onOpen, onMove, te, dash]);

  return <DataTable columns={columns} data={leads} emptyMessage={te.leads.table.empty} />;
}
