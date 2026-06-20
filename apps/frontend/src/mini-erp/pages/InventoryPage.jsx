import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Search, ArrowDownLeft, ArrowUpRight, AlertTriangle, Activity } from 'lucide-react';
import * as invApi from '../../services/inventoryApi';
import * as prodApi from '../../services/productsApi';
import { useAuth } from '../hooks/useAuth';
import { userCan } from '../utils/permissions';
import { formatNumber } from '../utils/formatters';
import { Button } from '@/mini-erp/components/ui/button';
import { Input } from '@/mini-erp/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/mini-erp/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/mini-erp/components/ui/select';
import KpiCard from '../components/data-display/KpiCard';
import MovementsTable from '../components/data-display/MovementsTable';
import MovementFormDialog from '../components/forms/MovementFormDialog';
import InventorySkeleton from '../components/feedback/InventorySkeleton';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { MOVEMENT_TYPE_FILTERS } from '../config/inventory';

export default function InventoryPage() {
  const { user } = useAuth();
  const canCreate = userCan(user, 'createMovement');

  const [movements, setMovements] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [movRes, lowRes, prodRes] = await Promise.all([
        invApi.listMovements({ limit: '100' }),
        invApi.lowStock(),
        prodApi.list({ limit: '100' }),
      ]);
      setMovements(movRes.data || []);
      setLowStock(lowRes.data || []);
      setProducts(prodRes.data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar el inventario');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const productsById = useMemo(() => {
    const map = {};
    for (const p of products) map[p.id] = p;
    return map;
  }, [products]);

  const stats = useMemo(() => ({
    inbound: movements.filter((m) => m.type === 'IN').length,
    outbound: movements.filter((m) => m.type === 'OUT').length,
    lowStock: lowStock.length,
    total: movements.length,
  }), [movements, lowStock]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return movements.filter((m) => {
      if (typeFilter !== 'all' && m.type !== typeFilter) return false;
      if (productFilter !== 'all' && m.productId !== productFilter) return false;
      if (!q) return true;
      const product = productsById[m.productId];
      const haystack = [m.reference, m.notes, product?.sku, product?.name]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [movements, typeFilter, productFilter, search, productsById]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Inventario</h1>
        <InventorySkeleton />
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventario</h1>
          <p className="mt-1 text-sm text-muted-foreground">Movimientos de stock y alertas de inventario</p>
        </div>
        {canCreate && (
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Registrar movimiento
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Entradas" value={formatNumber(stats.inbound)} icon={ArrowDownLeft} accent="green" />
        <KpiCard label="Salidas" value={formatNumber(stats.outbound)} icon={ArrowUpRight} accent="red" />
        <KpiCard label="Alertas bajo stock" value={formatNumber(stats.lowStock)} icon={AlertTriangle} accent="yellow" />
        <KpiCard label="Movimientos" value={formatNumber(stats.total)} icon={Activity} accent="violet" />
      </div>

      {lowStock.length > 0 && (
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="size-4 text-yellow-300" />
            <h2 className="text-sm font-semibold text-foreground">Productos con bajo stock ({lowStock.length})</h2>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {lowStock.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2 text-sm">
                <div className="min-w-0">
                  <p className="truncate text-foreground">{p.name}</p>
                  <p className="font-mono text-xs text-violet-300">{p.sku}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-medium text-red-300 tabular-nums">{formatNumber(p.stock)}</p>
                  <p className="text-[10px] text-muted-foreground">mín {formatNumber(p.minStock)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Movimientos recientes</h2>

        {movements.length === 0 ? (
          <div className="rounded-xl border border-border p-6">
            <EmptyState
              icon={Activity}
              title="Sin movimientos"
              message="Registra una entrada o salida para empezar a controlar el stock."
              action={canCreate ? { label: 'Registrar movimiento', icon: Plus, onClick: () => setCreateOpen(true) } : undefined}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por referencia o producto..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={productFilter} onValueChange={setProductFilter}>
                  <SelectTrigger className="w-full sm:w-56">
                    <SelectValue placeholder="Producto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los productos</SelectItem>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.sku} · {p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Tabs value={typeFilter} onValueChange={setTypeFilter}>
                <TabsList>
                  {MOVEMENT_TYPE_FILTERS.map((f) => (
                    <TabsTrigger key={f.value} value={f.value}>{f.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <MovementsTable movements={filtered} productsById={productsById} />
          </>
        )}
      </div>

      <MovementFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        products={products}
        onCreated={load}
      />
    </div>
  );
}
