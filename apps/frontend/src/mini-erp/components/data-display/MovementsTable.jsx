import { useMemo } from 'react';
import MovementTypeBadge from './MovementTypeBadge';
import DataTable from './DataTable';
import { movementProductLabel } from '../../config/inventory';
import { formatDateTime, formatNumber } from '../../utils/formatters';
import useErpTranslation from '../../i18n/useErpTranslation';

/** Inventory movements table (reuses the shared DataTable). */
export default function MovementsTable({ movements, productsById, renderToolbar }) {
  const { te, language } = useErpTranslation();

  const columns = useMemo(() => [
    {
      accessorKey: 'type',
      header: te.inventory.table.type,
      cell: ({ row }) => <MovementTypeBadge type={row.original.type} />,
    },
    {
      id: 'product',
      accessorFn: (m) => movementProductLabel(m, productsById),
      header: te.inventory.table.product,
      cell: ({ row }) => <span className="text-sm text-foreground">{movementProductLabel(row.original, productsById)}</span>,
    },
    {
      accessorKey: 'quantity',
      header: te.inventory.table.quantity,
      meta: { className: 'text-right' },
      cell: ({ row }) => <span className="tabular-nums">{formatNumber(row.original.quantity, language)}</span>,
    },
    {
      accessorKey: 'stockBefore',
      header: te.inventory.table.stockBefore,
      meta: { className: 'text-right' },
      cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{formatNumber(row.original.stockBefore, language)}</span>,
    },
    {
      accessorKey: 'stockAfter',
      header: te.inventory.table.stockAfter,
      meta: { className: 'text-right' },
      cell: ({ row }) => <span className="tabular-nums font-medium text-foreground">{formatNumber(row.original.stockAfter, language)}</span>,
    },
    {
      accessorKey: 'reference',
      header: te.inventory.table.reference,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.reference || te.formats.emptyValue}</span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: te.inventory.table.date,
      meta: { className: 'text-right' },
      cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatDateTime(row.original.createdAt, language)}</span>,
    },
  ], [te, language, productsById]);

  return (
    <DataTable
      columns={columns}
      data={movements}
      renderToolbar={renderToolbar}
      emptyMessage={te.inventory.table.empty}
    />
  );
}
