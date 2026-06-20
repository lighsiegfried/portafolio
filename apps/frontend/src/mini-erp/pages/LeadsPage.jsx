import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { Plus, Search, LayoutGrid, Table as TableIcon, Users, Activity, Trophy, Wallet } from 'lucide-react';
import * as api from '../../services/leadsApi';
import { useAuth } from '../hooks/useAuth';
import { userCan } from '../utils/permissions';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { Button } from '@/mini-erp/components/ui/button';
import { Input } from '@/mini-erp/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/mini-erp/components/ui/select';
import KpiCard from '../components/data-display/KpiCard';
import LeadsBoard from '../components/data-display/LeadsBoard';
import LeadsTable from '../components/data-display/LeadsTable';
import LeadDetailSheet from '../components/data-display/LeadDetailSheet';
import LeadsBoardSkeleton from '../components/feedback/LeadsBoardSkeleton';
import LeadFormDialog from '../components/forms/LeadFormDialog';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { LEAD_SOURCES, leadCompany, leadContact, stageLabel } from '../config/leads';

export default function LeadsPage() {
  const { user } = useAuth();
  const canManage = userCan(user, 'manageLeads');

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('kanban');
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formState, setFormState] = useState({ open: false, lead: null });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.list({ limit: '100' });
      setLeads(res.data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar leads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (sourceFilter !== 'all' && l.source !== sourceFilter) return false;
      if (!q) return true;
      return [leadCompany(l), leadContact(l), l.email]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [leads, search, sourceFilter]);

  const stats = useMemo(() => {
    const active = leads.filter((l) => l.status !== 'won' && l.status !== 'lost');
    return {
      total: leads.length,
      active: active.length,
      won: leads.filter((l) => l.status === 'won').length,
      pipelineValue: active.reduce((sum, l) => sum + (l.estimatedValue || 0), 0),
    };
  }, [leads]);

  const selectedLead = useMemo(() => leads.find((l) => l.id === selectedId) || null, [leads, selectedId]);

  function openDetail(lead) {
    setSelectedId(lead.id);
    setDetailOpen(true);
  }

  const moveLead = useCallback(async (lead, newStatus) => {
    if (lead.status === newStatus) return;
    const previous = leads;
    setLeads((list) => list.map((l) => (l.id === lead.id ? { ...l, status: newStatus } : l)));
    try {
      await api.update(lead.id, { status: newStatus });
      toast.success(`Lead movido a "${stageLabel(newStatus)}"`);
    } catch (err) {
      setLeads(previous);
      toast.error(err.message || 'Error al mover el lead');
    }
  }, [leads]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">CRM Lite</h1>
        <LeadsBoardSkeleton />
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">CRM Lite</h1>
          <p className="text-sm text-muted-foreground">Pipeline de leads y clientes potenciales</p>
        </div>
        {canManage && (
          <Button size="sm" onClick={() => setFormState({ open: true, lead: null })}>
            <Plus className="size-4" />
            Nuevo lead
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total leads" value={formatNumber(stats.total)} icon={Users} accent="violet" />
        <KpiCard label="Activos" value={formatNumber(stats.active)} icon={Activity} accent="cyan" />
        <KpiCard label="Ganados" value={formatNumber(stats.won)} icon={Trophy} accent="green" />
        <KpiCard label="Valor en pipeline" value={formatCurrency(stats.pipelineValue)} icon={Wallet} accent="yellow" />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar empresa, contacto o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Fuente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las fuentes</SelectItem>
              {LEAD_SOURCES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
          <Button
            variant={view === 'kanban' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 gap-1.5"
            onClick={() => setView('kanban')}
          >
            <LayoutGrid className="size-4" />
            Pipeline
          </Button>
          <Button
            variant={view === 'table' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 gap-1.5"
            onClick={() => setView('table')}
          >
            <TableIcon className="size-4" />
            Tabla
          </Button>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-xl border border-border p-6">
          <EmptyState message="Aún no hay leads registrados" />
        </div>
      ) : view === 'kanban' ? (
        <LeadsBoard leads={filtered} canManage={canManage} onOpen={openDetail} onMove={moveLead} />
      ) : (
        <LeadsTable leads={filtered} canManage={canManage} onOpen={openDetail} onMove={moveLead} />
      )}

      <LeadDetailSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        lead={selectedLead}
        canManage={canManage}
        onEdit={(lead) => { setDetailOpen(false); setFormState({ open: true, lead }); }}
        onChanged={load}
      />

      <LeadFormDialog
        open={formState.open}
        lead={formState.lead}
        onOpenChange={(open) => setFormState((s) => ({ ...s, open }))}
        onSaved={load}
      />
    </div>
  );
}
