import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { Plus, Search, LayoutGrid, Table as TableIcon, Users, Activity, Trophy, Wallet } from 'lucide-react';
import * as api from '../../services/leadsApi';
import { useAuth } from '../hooks/useAuth';
import useErpTranslation from '../i18n/useErpTranslation';
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
import ConfirmDialog from '../components/feedback/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { LEAD_SOURCES, leadCompany, leadContact, stageLabel } from '../config/leads';

export default function LeadsPage() {
  const { user } = useAuth();
  const { te } = useErpTranslation();
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
  const [pendingMove, setPendingMove] = useState(null); // { lead, newStatus } for confirmation

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.list({ limit: '100' });
      setLeads(res.data || []);
    } catch (err) {
      // Only the raw API message is stored; the localized fallback is resolved
      // at render time so it follows the active language without refetching.
      setError(err.message || '');
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
      toast.success(te.toast.leadMoved.replace('{stage}', te.status.lead[newStatus] ?? stageLabel(newStatus)));
    } catch (err) {
      setLeads(previous);
      toast.error(err.message || te.errors.moveLead);
    }
  }, [leads, te]);

  // Quick status moves (board/table). Marking a lead as "Perdido" is a negative,
  // hard-to-reverse outcome, so it requires explicit confirmation first.
  const requestMove = useCallback((lead, newStatus) => {
    if (lead.status === newStatus) return;
    if (newStatus === 'lost') {
      setPendingMove({ lead, newStatus });
      return;
    }
    moveLead(lead, newStatus);
  }, [moveLead]);

  async function confirmMove() {
    if (!pendingMove) return;
    const { lead, newStatus } = pendingMove;
    setPendingMove(null);
    await moveLead(lead, newStatus);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{te.leads.title}</h1>
        <LeadsBoardSkeleton />
      </div>
    );
  }
  if (error !== null) return <ErrorState message={error || te.errors.loadLeads} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{te.leads.title}</h1>
          <p className="text-sm text-muted-foreground">{te.leads.subtitle}</p>
        </div>
        {canManage && (
          <Button size="sm" onClick={() => setFormState({ open: true, lead: null })}>
            <Plus aria-hidden="true" className="size-4" />
            {te.leads.newButton}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label={te.leads.kpi.total} value={formatNumber(stats.total)} icon={Users} accent="violet" />
        <KpiCard label={te.leads.kpi.active} value={formatNumber(stats.active)} icon={Activity} accent="cyan" />
        <KpiCard label={te.leads.kpi.won} value={formatNumber(stats.won)} icon={Trophy} accent="green" />
        <KpiCard label={te.leads.kpi.pipelineValue} value={formatCurrency(stats.pipelineValue)} icon={Wallet} accent="yellow" />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={te.leads.searchPlaceholder}
              aria-label={te.leads.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-full sm:w-44" aria-label={te.leads.sourceFilterPlaceholder}>
              <SelectValue placeholder={te.leads.sourceFilterPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{te.leads.sourceFilterAll}</SelectItem>
              {LEAD_SOURCES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{te.leads.sources[s.value] ?? s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
          <Button
            variant={view === 'kanban' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 gap-1.5"
            onClick={() => setView('kanban')}
          >
            <LayoutGrid aria-hidden="true" className="size-4" />
            {te.leads.view.pipeline}
          </Button>
          <Button
            variant={view === 'table' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 gap-1.5"
            onClick={() => setView('table')}
          >
            <TableIcon aria-hidden="true" className="size-4" />
            {te.leads.view.table}
          </Button>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="erp-surface-card rounded-xl p-6">
          <EmptyState
            icon={Users}
            title={te.leads.empty.title}
            message={te.leads.empty.message}
            action={canManage ? { label: te.leads.newButton, icon: Plus, onClick: () => setFormState({ open: true, lead: null }) } : undefined}
          />
        </div>
      ) : view === 'kanban' ? (
        <LeadsBoard leads={filtered} canManage={canManage} onOpen={openDetail} onMove={requestMove} />
      ) : (
        <LeadsTable leads={filtered} canManage={canManage} onOpen={openDetail} onMove={requestMove} />
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

      <ConfirmDialog
        open={Boolean(pendingMove)}
        onOpenChange={(o) => { if (!o) setPendingMove(null); }}
        title={te.leads.confirmLost.title}
        description={pendingMove ? te.leads.confirmLost.descriptionBoard.replace('{company}', leadCompany(pendingMove.lead)) : ''}
        confirmLabel={te.leads.confirmLost.confirm}
        destructive
        onConfirm={confirmMove}
      />
    </div>
  );
}
