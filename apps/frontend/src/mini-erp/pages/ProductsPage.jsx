import { useState, useEffect, useCallback, useMemo } from 'react';
import { Package, AlertTriangle, Tags, Wallet, Plus, MoreHorizontal, Pencil, ArrowLeftRight, Search } from 'lucide-react';
import * as api from '../../services/productsApi';
import { useAuth } from '../hooks/useAuth';
import useErpTranslation from '../i18n/useErpTranslation';
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
  const { te } = useErpTranslation();
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
      // Only the raw API message is stored; the localized fallback is resolved
      // at render time so it follows the active language without refetching.
      setError(err.message || '');
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
        header: te.products.table.sku,
        cell: ({ row }) => <span className="font-mono text-xs text-violet-600 dark:text-violet-300">{row.original.sku}</span>,
      },
      {
        accessorKey: 'name',
        header: te.products.table.name,
        cell: ({ row }) => (
          <div className="min-w-0">
            <span className="font-medium text-foreground">{row.original.name}</span>
            {row.original.active === false && (
              <Badge variant="outline" className="ml-2 text-[10px]">{te.products.table.inactive}</Badge>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: te.products.table.category,
        filterFn: 'equals',
        cell: ({ row }) => (
          <Badge variant="secondary">
            {te.products.categories[row.original.category] ?? categoryLabel(row.original.category)}
          </Badge>
        ),
      },
      {
        accessorKey: 'stock',
        header: te.products.table.stock,
        meta: { className: 'text-right' },
        cell: ({ row }) => {
          const low = isLowStock(row.original);
          return (
            <span className="inline-flex items-center justify-end gap-2">
              <span className={low ? 'font-medium text-destructive' : 'text-foreground'}>{formatNumber(row.original.stock)}</span>
              {low && <Badge variant="destructive" className="text-[10px]">{te.products.table.lowBadge}</Badge>}
            </span>
          );
        },
      },
      {
        accessorKey: 'minStock',
        header: te.products.table.minStock,
        meta: { className: 'text-right' },
        cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatNumber(row.original.minStock)}</span>,
      },
      {
        accessorKey: 'unit',
        header: te.products.table.unit,
        cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.unit}</span>,
      },
      {
        accessorKey: 'price',
        header: te.products.table.price,
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
              <Button variant="ghost" size="icon" className="size-8" aria-label={te.common.actions}>
                <MoreHorizontal aria-hidden="true" className="size-4" />
                <span className="sr-only">{te.common.actions}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canEdit && (
                <DropdownMenuItem onClick={() => setFormState({ open: true, product: row.original })}>
                  <Pencil aria-hidden="true" className="size-4" />
                  {te.products.rowActions.edit}
                </DropdownMenuItem>
              )}
              {canAdjustStock && (
                <DropdownMenuItem onClick={() => setStockState({ open: true, product: row.original })}>
                  <ArrowLeftRight aria-hidden="true" className="size-4" />
                  {te.products.rowActions.adjustStock}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      });
    }

    return cols;
  }, [hasRowActions, canEdit, canAdjustStock, te]);

  if (loading) return <ProductsSkeleton />;
  if (error !== null) return <ErrorState message={error || te.errors.loadProducts} onRetry={load} />;

  const products = data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{te.products.title}</h1>
          <p className="text-sm text-muted-foreground">{te.products.subtitle}</p>
        </div>
        {canCreate && (
          <Button size="sm" onClick={() => setFormState({ open: true, product: null })}>
            <Plus aria-hidden="true" className="size-4" />
            {te.products.newButton}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label={te.products.kpi.total} value={formatNumber(stats.total)} icon={Package} accent="violet" />
        <KpiCard label={te.products.kpi.lowStock} value={formatNumber(stats.lowStock)} icon={AlertTriangle} accent="red" />
        <KpiCard label={te.products.kpi.categories} value={formatNumber(stats.categories)} icon={Tags} accent="cyan" />
        <KpiCard label={te.products.kpi.inventoryValue} value={formatCurrency(stats.inventoryValue)} icon={Wallet} accent="green" />
      </div>

      {products.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={Package}
            title={te.products.empty.title}
            message={te.products.empty.message}
            action={canCreate ? { label: te.products.newButton, icon: Plus, onClick: () => setFormState({ open: true, product: null }) } : undefined}
          />
        </Card>
      ) : (
        <DataTable
          columns={columns}
          data={products}
          emptyMessage={te.products.table.empty}
          renderToolbar={(table) => {
            const categoryValue = table.getColumn('category')?.getFilterValue() ?? 'all';
            return (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative w-full sm:max-w-xs">
                  <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={te.products.searchPlaceholder}
                    aria-label={te.products.searchPlaceholder}
                    value={table.getState().globalFilter ?? ''}
                    onChange={(e) => table.setGlobalFilter(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={categoryValue}
                  onValueChange={(v) => table.getColumn('category')?.setFilterValue(v === 'all' ? undefined : v)}
                >
                  <SelectTrigger className="w-full sm:w-48" aria-label={te.products.categoryFilterPlaceholder}>
                    <SelectValue placeholder={te.products.categoryFilterPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{te.products.categoryFilterAll}</SelectItem>
                    {PRODUCT_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{te.products.categories[c.value] ?? c.label}</SelectItem>
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
