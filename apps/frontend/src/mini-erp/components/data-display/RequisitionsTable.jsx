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
import { allowedActions, itemsTotal, PRIORITY_STYLES } from '../../config/requisitions';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { cn } from '@/mini-erp/lib/utils';

/** Professional requisitions table (reuses the shared DataTable). */
export default function RequisitionsTable({ requisitions, user, onOpen, onAction, renderToolbar }) {
  const columns = useMemo(() => [
    {
      accessorKey: 'number',
      header: 'Número',
      cell: ({ row }) => <span className="font-mono text-xs text-violet-300">{row.original.number}</span>,
    },
    {
      accessorKey: 'title',
      header: 'Título',
      cell: ({ row }) => <span className="font-medium text-foreground">{row.original.title}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'priority',
      header: 'Prioridad',
      cell: ({ row }) => (
        <span className={cn('text-xs font-medium capitalize', PRIORITY_STYLES[row.original.priority] || 'text-muted-foreground')}>
          {row.original.priority || '-'}
        </span>
      ),
    },
    {
      id: 'total',
      accessorFn: (r) => itemsTotal(r),
      header: 'Costo est.',
      meta: { className: 'text-right' },
      cell: ({ row }) => <span className="tabular-nums">{formatCurrency(itemsTotal(row.original))}</span>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha',
      meta: { className: 'text-right' },
      cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatDate(row.original.createdAt)}</span>,
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      meta: { className: 'text-right' },
      cell: ({ row }) => {
        const req = row.original;
        const actions = allowedActions(req, user);
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Acciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onOpen(req)}>
                <Eye className="size-4" />
                Ver detalle
              </DropdownMenuItem>
              {actions.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Flujo</DropdownMenuLabel>
                  {actions.map((action) => (
                    <DropdownMenuItem key={action.key} onClick={() => onAction(req, action)}>
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [user, onOpen, onAction]);

  return (
    <DataTable
      columns={columns}
      data={requisitions}
      renderToolbar={renderToolbar}
      emptyMessage="No hay requisiciones en este estado"
    />
  );
}
