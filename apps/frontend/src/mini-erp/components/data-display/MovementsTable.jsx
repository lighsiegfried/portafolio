import { useMemo } from 'react';
import MovementTypeBadge from './MovementTypeBadge';
import DataTable from './DataTable';
import { movementProductLabel } from '../../config/inventory';
import { formatDateTime, formatNumber } from '../../utils/formatters';

/** Inventory movements table (reuses the shared DataTable). */
export default function MovementsTable({ movements, productsById, renderToolbar }) {
  const columns = useMemo(() => [
    {
      accessorKey: 'type',
      header: 'Tipo',
      cell: ({ row }) => <MovementTypeBadge type={row.original.type} />,
    },
    {
      id: 'product',
      accessorFn: (m) => movementProductLabel(m, productsById),
      header: 'Producto',
      cell: ({ row }) => <span className="text-sm text-foreground">{movementProductLabel(row.original, productsById)}</span>,
    },
    {
      accessorKey: 'quantity',
      header: 'Cantidad',
      meta: { className: 'text-right' },
      cell: ({ row }) => <span className="tabular-nums">{formatNumber(row.original.quantity)}</span>,
    },
    {
      accessorKey: 'stockBefore',
      header: 'Stock antes',
      meta: { className: 'text-right' },
      cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{formatNumber(row.original.stockBefore)}</span>,
    },
    {
      accessorKey: 'stockAfter',
      header: 'Stock después',
      meta: { className: 'text-right' },
      cell: ({ row }) => <span className="tabular-nums font-medium text-foreground">{formatNumber(row.original.stockAfter)}</span>,
    },
    {
      accessorKey: 'reference',
      header: 'Referencia',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.reference || '-'}</span>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha',
      meta: { className: 'text-right' },
      cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatDateTime(row.original.createdAt)}</span>,
    },
  ], [productsById]);

  return (
    <DataTable
      columns={columns}
      data={movements}
      renderToolbar={renderToolbar}
      emptyMessage="No hay movimientos que coincidan con los filtros"
    />
  );
}
