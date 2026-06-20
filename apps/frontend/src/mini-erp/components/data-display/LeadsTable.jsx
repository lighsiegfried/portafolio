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

/** Enhanced table view of leads (reuses the shared DataTable). */
export default function LeadsTable({ leads, canManage, onOpen, onMove }) {
  const columns = useMemo(() => [
    { id: 'company', accessorFn: (l) => leadCompany(l), header: 'Empresa', cell: ({ row }) => <span className="font-medium text-foreground">{leadCompany(row.original)}</span> },
    { id: 'contact', accessorFn: (l) => leadContact(l), header: 'Contacto', cell: ({ row }) => <span className="text-muted-foreground">{leadContact(row.original)}</span> },
    { accessorKey: 'email', header: 'Email', cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.email || '-'}</span> },
    { accessorKey: 'status', header: 'Estado', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'source', header: 'Fuente', cell: ({ row }) => <span className="text-xs text-muted-foreground">{sourceLabel(row.original.source)}</span> },
    {
      accessorKey: 'estimatedValue',
      header: 'Valor',
      meta: { className: 'text-right' },
      cell: ({ row }) => <span className="tabular-nums">{row.original.estimatedValue != null ? formatCurrency(row.original.estimatedValue) : '-'}</span>,
    },
    {
      accessorKey: 'nextFollowUp',
      header: 'Seguimiento',
      meta: { className: 'text-right' },
      cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.nextFollowUp ? formatDate(row.original.nextFollowUp) : '-'}</span>,
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
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Acciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onOpen(lead)}>
                <Eye className="size-4" />
                Ver detalle
              </DropdownMenuItem>
              {canManage && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Mover a</DropdownMenuLabel>
                  {LEAD_STAGES.filter((s) => s.status !== lead.status).map((s) => (
                    <DropdownMenuItem key={s.status} onClick={() => onMove(lead, s.status)}>
                      {s.label}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [canManage, onOpen, onMove]);

  return <DataTable columns={columns} data={leads} emptyMessage="Ningún lead coincide con la búsqueda" />;
}
