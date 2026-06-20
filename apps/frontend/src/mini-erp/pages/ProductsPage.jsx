import { useState, useEffect, useCallback, useMemo } from 'react';
import { Package, AlertTriangle, Tags, Wallet, Plus, MoreHorizontal, Pencil, ArrowLeftRight, Search } from 'lucide-react';
import * as api from '../../services/productsApi';
import { useAuth } from '../hooks/useAuth';
import { userCan } from '../utils/permissions';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { Card } from '@/mini-erp/components/ui/card';
import { Button } from '@/mini-erp/components/ui/button';
import { Input } from '@/mini-erp/components/ui/input';
import { Badge } from '@/mini-erp/components/ui/badge';
import { Skeleton } from '@/mini-erp/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/mini-erp/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/mini-erp/components/ui/dropdown-menu';
import KpiCard from '../components/data-display/KpiCard';
import DataTable from '../components/data-display/DataTable';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import ProductFormDialog, { PRODUCT_CATEGORIES, categoryLabel } from '../components/forms/ProductFormDialog';
import StockAdjustDialog from '../components/forms/StockAdjustDialog';

function isLowStock(p) {
  return (p.stock ?? 0) <= (p.minStock ?? 0);
}

function ProductsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-7 w-20" />
          </Card>
        ))}
      </div>
      <Skeleton className="h-9 w-full max-w-sm" />
      <Skeleton className="h-72 w-full rounded-xl" />
    </div>
  );
}

export default function ProductsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formState, setFormState] = useState({ open: false, product: null });
  const [stockState, setStockState] = useState({ open: false, product: null });

  const canCreate = userCan(user, 'createProduct');
  const canEdit = userCan(user, 'updateProduct');
  const canAdjustStock = userCan(user, 'updateStock');
  const hasRowActions = canEdit || canAdjustStock;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.list({ limit: '50' });
      setData(res.data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const stats = useMemo(() => {
    const list = data || [];
    const categories = new Set(list.map((p) => p.category).filter(Boolean));
    return {
      total: list.length,
      lowStock: list.filter(isLowStock).length,
      categories: categories.size,
      inventoryValue: list.reduce((sum, p) => sum + (p.stock || 0) * (p.price || 0), 0),
    };
  }, [data]);

  const columns = useMemo(() => {
    const cols = [
      {
        accessorKey: 'sku',
        header: 'SKU',
        cell: ({ row }) => <span className="font-mono text-xs text-violet-300">{row.original.sku}</span>,
      },
      {
        accessorKey: 'name',
        header: 'Nombre',
        cell: ({ row }) => (
          <div className="min-w-0">
            <span className="font-medium text-foreground">{row.original.name}</span>
            {row.original.active === false && (
              <Badge variant="outline" className="ml-2 text-[10px]">Inactivo</Badge>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Categoría',
        filterFn: 'equals',
        cell: ({ row }) => <Badge variant="secondary">{categoryLabel(row.original.category)}</Badge>,
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        meta: { className: 'text-right' },
        cell: ({ row }) => {
          const low = isLowStock(row.original);
          return (
            <span className="inline-flex items-center justify-end gap-2">
              <span className={low ? 'font-medium text-red-300' : 'text-foreground'}>{formatNumber(row.original.stock)}</span>
              {low && <Badge variant="destructive" className="text-[10px]">Bajo</Badge>}
            </span>
          );
        },
      },
      {
        accessorKey: 'minStock',
        header: 'Mínimo',
        meta: { className: 'text-right' },
        cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatNumber(row.original.minStock)}</span>,
      },
      {
        accessorKey: 'unit',
        header: 'Unidad',
        cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.unit}</span>,
      },
      {
        accessorKey: 'price',
        header: 'Precio',
        meta: { className: 'text-right' },
        cell: ({ row }) => <span className="tabular-nums">{formatCurrency(row.original.price)}</span>,
      },
    ];

    if (hasRowActions) {
      cols.push({
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { className: 'text-right' },
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Acciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canEdit && (
                <DropdownMenuItem onClick={() => setFormState({ open: true, product: row.original })}>
                  <Pencil className="size-4" />
                  Editar
                </DropdownMenuItem>
              )}
              {canAdjustStock && (
                <DropdownMenuItem onClick={() => setStockState({ open: true, product: row.original })}>
                  <ArrowLeftRight className="size-4" />
                  Ajustar stock
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      });
    }

    return cols;
  }, [hasRowActions, canEdit, canAdjustStock]);

  if (loading) return <ProductsSkeleton />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const products = data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Productos</h1>
          <p className="text-sm text-muted-foreground">Catálogo de productos y materiales</p>
        </div>
        {canCreate && (
          <Button size="sm" onClick={() => setFormState({ open: true, product: null })}>
            <Plus className="size-4" />
            Nuevo producto
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total productos" value={formatNumber(stats.total)} icon={Package} accent="violet" />
        <KpiCard label="Bajo stock" value={formatNumber(stats.lowStock)} icon={AlertTriangle} accent="red" />
        <KpiCard label="Categorías" value={formatNumber(stats.categories)} icon={Tags} accent="cyan" />
        <KpiCard label="Valor inventario" value={formatCurrency(stats.inventoryValue)} icon={Wallet} accent="green" />
      </div>

      {products.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={Package}
            title="Catálogo vacío"
            message="Agrega tu primer producto para empezar a gestionar el inventario."
            action={canCreate ? { label: 'Nuevo producto', icon: Plus, onClick: () => setFormState({ open: true, product: null }) } : undefined}
          />
        </Card>
      ) : (
        <DataTable
          columns={columns}
          data={products}
          emptyMessage="Ningún producto coincide con la búsqueda"
          renderToolbar={(table) => {
            const categoryValue = table.getColumn('category')?.getFilterValue() ?? 'all';
            return (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por SKU o nombre..."
                    value={table.getState().globalFilter ?? ''}
                    onChange={(e) => table.setGlobalFilter(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={categoryValue}
                  onValueChange={(v) => table.getColumn('category')?.setFilterValue(v === 'all' ? undefined : v)}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {PRODUCT_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }}
        />
      )}

      <ProductFormDialog
        open={formState.open}
        product={formState.product}
        onOpenChange={(open) => setFormState((s) => ({ ...s, open }))}
        onSaved={load}
      />
      <StockAdjustDialog
        open={stockState.open}
        product={stockState.product}
        onOpenChange={(open) => setStockState((s) => ({ ...s, open }))}
        onSaved={load}
      />
    </div>
  );
}
