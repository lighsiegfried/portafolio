import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/mini-erp/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/mini-erp/components/ui/table';
import { Badge } from '@/mini-erp/components/ui/badge';
import { Button } from '@/mini-erp/components/ui/button';
import { Skeleton } from '@/mini-erp/components/ui/skeleton';
import EmptyState from '../EmptyState';
import ErrorState from '../ErrorState';
import { lowStock as fetchLowStock } from '../../../services/inventoryApi';
import { formatNumber } from '../../utils/formatters';

/**
 * Low-stock alerts. Rendered only for roles with `viewInventory` (gated by the
 * parent), and fetches the existing /inventory/low-stock endpoint independently
 * so a failure here never breaks the rest of the dashboard.
 */
export default function LowStockAlerts() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLowStock();
      setRows(res.data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar bajo stock');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="size-4 text-red-400" />
          Alertas de bajo stock
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => navigate('/mini-erp/inventory')}>
          Ver inventario
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-9 w-full" />)}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : !rows || rows.length === 0 ? (
          <EmptyState message="Sin productos en bajo stock" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Mínimo</TableHead>
                <TableHead className="text-right">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.id || p.sku}>
                  <TableCell className="font-mono text-xs text-violet-300">{p.sku}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{p.name}</TableCell>
                  <TableCell className="text-right font-medium text-red-300">{formatNumber(p.stock)}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">{formatNumber(p.minStock)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="destructive">Bajo stock</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
