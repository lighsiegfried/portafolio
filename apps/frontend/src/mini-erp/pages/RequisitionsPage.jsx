import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { Plus, Search, FileText, Clock, CheckCircle2, Wallet } from 'lucide-react';
import * as api from '../../services/requisitionsApi';
import { useAuth } from '../hooks/useAuth';
import { userCan } from '../utils/permissions';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { Button } from '@/mini-erp/components/ui/button';
import { Input } from '@/mini-erp/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/mini-erp/components/ui/tabs';
import KpiCard from '../components/data-display/KpiCard';
import RequisitionsTable from '../components/data-display/RequisitionsTable';
import RequisitionDetailSheet from '../components/data-display/RequisitionDetailSheet';
import RequisitionFormDialog from '../components/forms/RequisitionFormDialog';
import RequisitionActionDialog from '../components/forms/RequisitionActionDialog';
import RequisitionsTableSkeleton from '../components/feedback/RequisitionsTableSkeleton';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { REQ_FILTERS, itemsTotal } from '../config/requisitions';

export default function RequisitionsPage() {
  const { user } = useAuth();
  const canCreate = userCan(user, 'createRequisition');

  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // { req, action }
  const [actionSubmitting, setActionSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.list({ limit: '50' });
      setRequisitions(res.data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar requisiciones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const counts = useMemo(() => {
    const c = { all: requisitions.length, pending: 0, approved: 0, completed: 0, rejected: 0 };
    for (const r of requisitions) if (c[r.status] != null) c[r.status] += 1;
    return c;
  }, [requisitions]);

  const stats = useMemo(() => ({
    total: requisitions.length,
    pending: counts.pending,
    completed: counts.completed,
    pipelineValue: requisitions
      .filter((r) => r.status === 'pending' || r.status === 'approved')
      .reduce((sum, r) => sum + itemsTotal(r), 0),
  }), [requisitions, counts]);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return requisitions;
    return requisitions.filter((r) => r.status === statusFilter);
  }, [requisitions, statusFilter]);

  const selected = useMemo(
    () => requisitions.find((r) => r.id === selectedId) || null,
    [requisitions, selectedId]
  );

  function openDetail(req) {
    setSelectedId(req.id);
    setDetailOpen(true);
  }

  function requestAction(req, action) {
    setPendingAction({ req, action });
  }

  async function confirmAction(reason) {
    if (!pendingAction) return;
    const { req, action } = pendingAction;
    setActionSubmitting(true);
    try {
      if (action.key === 'approve') await api.approve(req.id);
      else if (action.key === 'reject') await api.reject(req.id, reason);
      else if (action.key === 'complete') await api.complete(req.id);
      toast.success(action.successMessage);
      setPendingAction(null);
      await load();
    } catch (err) {
      toast.error(err.message || 'Error al ejecutar la acción');
    } finally {
      setActionSubmitting(false);
    }
  }

  const renderToolbar = (table) => (
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Buscar por número o título..."
        value={table.getState().globalFilter ?? ''}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        className="pl-9"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Requisiciones</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Flujo de aprobación de compras: <span className="text-foreground">Pendiente → Aprobada → Completada</span>
            {' '}· una requisición pendiente también puede ser rechazada.
          </p>
        </div>
        {canCreate && (
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Nueva requisición
          </Button>
        )}
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : loading ? (
        <RequisitionsTableSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KpiCard label="Total" value={formatNumber(stats.total)} icon={FileText} accent="violet" />
            <KpiCard label="Pendientes" value={formatNumber(stats.pending)} icon={Clock} accent="yellow" />
            <KpiCard label="Completadas" value={formatNumber(stats.completed)} icon={CheckCircle2} accent="green" />
            <KpiCard label="Valor en proceso" value={formatCurrency(stats.pipelineValue)} icon={Wallet} accent="cyan" />
          </div>

          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="flex-wrap">
              {REQ_FILTERS.map((f) => (
                <TabsTrigger key={f.value} value={f.value} className="gap-1.5">
                  {f.label}
                  <span className="rounded-full bg-background/60 px-1.5 text-[10px] tabular-nums text-muted-foreground">
                    {counts[f.value] ?? 0}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {requisitions.length === 0 ? (
            <div className="rounded-xl border border-border p-6">
              <EmptyState message="Aún no hay requisiciones registradas" />
            </div>
          ) : (
            <RequisitionsTable
              requisitions={filtered}
              user={user}
              onOpen={openDetail}
              onAction={requestAction}
              renderToolbar={renderToolbar}
            />
          )}
        </>
      )}

      <RequisitionDetailSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        requisition={selected}
        user={user}
        onAction={requestAction}
      />

      <RequisitionFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={load}
      />

      <RequisitionActionDialog
        action={pendingAction?.action || null}
        requisition={pendingAction?.req || null}
        submitting={actionSubmitting}
        onConfirm={confirmAction}
        onClose={() => setPendingAction(null)}
      />
    </div>
  );
}
