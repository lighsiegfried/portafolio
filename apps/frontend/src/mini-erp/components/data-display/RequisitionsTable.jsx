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
import useErpTranslation from '../../i18n/useErpTranslation';
import { cn } from '@/mini-erp/lib/utils';

/** Professional requisitions table (reuses the shared DataTable). */
export default function RequisitionsTable({ requisitions, user, onOpen, onAction, renderToolbar }) {
  const { te, language } = useErpTranslation();

  const columns = useMemo(() => [
    {
      accessorKey: 'number',
      header: te.requisitions.table.number,
      cell: ({ row }) => (
        <span className="font-mono text-xs text-violet-600 dark:text-violet-300">{row.original.number}</span>
      ),
    },
    {
      accessorKey: 'title',
      header: te.requisitions.table.title,
      cell: ({ row }) => <span className="font-medium text-foreground">{row.original.title}</span>,
    },
    {
      accessorKey: 'status',
      header: te.requisitions.table.status,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'priority',
      header: te.requisitions.table.priority,
      cell: ({ row }) => (
        <span className={cn('text-xs font-medium capitalize', PRIORITY_STYLES[row.original.priority] || 'text-muted-foreground')}>
          {te.status.priority[row.original.priority] || row.original.priority || te.formats.emptyValue}
        </span>
      ),
    },
    {
      id: 'total',
      accessorFn: (r) => itemsTotal(r),
      header: te.requisitions.table.estimatedCost,
      meta: { className: 'text-right' },
      cell: ({ row }) => <span className="tabular-nums">{formatCurrency(itemsTotal(row.original), language)}</span>,
    },
    {
      accessorKey: 'createdAt',
      header: te.requisitions.table.date,
      meta: { className: 'text-right' },
      cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatDate(row.original.createdAt, language)}</span>,
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
              <Button variant="ghost" size="icon" className="size-8" aria-label={te.common.actions}>
                <MoreHorizontal className="size-4" aria-hidden="true" />
                <span className="sr-only">{te.common.actions}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onOpen(req)}>
                <Eye className="size-4" aria-hidden="true" />
                {te.common.viewDetail}
              </DropdownMenuItem>
              {actions.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>{te.requisitions.table.flowGroup}</DropdownMenuLabel>
                  {actions.map((action) => (
                    <DropdownMenuItem key={action.key} onClick={() => onAction(req, action)}>
                      {te.requisitions.actions[action.key] || action.label}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [te, language, user, onOpen, onAction]);

  return (
    <DataTable
      columns={columns}
      data={requisitions}
      renderToolbar={renderToolbar}
      emptyMessage={te.requisitions.table.empty}
    />
  );
}
