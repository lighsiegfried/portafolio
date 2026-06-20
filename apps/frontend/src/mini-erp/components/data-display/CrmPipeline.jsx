import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/mini-erp/components/ui/card';
import { Skeleton } from '@/mini-erp/components/ui/skeleton';
import EmptyState from '../EmptyState';
import ErrorState from '../ErrorState';
import { list as fetchLeads } from '../../../services/leadsApi';
import { formatNumber } from '../../utils/formatters';

const STAGES = [
  { key: 'new', label: 'Nuevo', color: 'bg-cyan-500' },
  { key: 'in_contact', label: 'En contacto', color: 'bg-indigo-500' },
  { key: 'negotiation', label: 'Negociación', color: 'bg-violet-500' },
  { key: 'won', label: 'Ganado', color: 'bg-emerald-500' },
  { key: 'lost', label: 'Perdido', color: 'bg-gray-500' },
];

/**
 * CRM pipeline overview. Rendered only for roles with `viewLeads` (gated by the
 * parent). Aggregates the existing /leads list client-side into stage counts and
 * renders lightweight CSS bars (no chart library). Isolated fetch + states.
 */
export default function CrmPipeline() {
  const [counts, setCounts] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLeads({ limit: '100' });
      const leads = res.data || [];
      const tally = STAGES.reduce((acc, s) => ({ ...acc, [s.key]: 0 }), {});
      leads.forEach((l) => {
        if (l.status in tally) tally[l.status] += 1;
      });
      setCounts(tally);
      setTotal(leads.length);
    } catch (err) {
      setError(err.message || 'Error al cargar leads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const max = counts ? Math.max(1, ...STAGES.map((s) => counts[s.key])) : 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pipeline CRM</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {STAGES.map((s) => <Skeleton key={s.key} className="h-7 w-full" />)}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : total === 0 ? (
          <EmptyState message="Sin leads registrados" />
        ) : (
          <div className="space-y-3">
            {STAGES.map((s) => {
              const value = counts[s.key];
              const width = `${(value / max) * 100}%`;
              return (
                <div key={s.key}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-medium text-foreground">{formatNumber(value)}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width }} />
                  </div>
                </div>
              );
            })}
            <p className="pt-1 text-xs text-muted-foreground">{formatNumber(total)} leads en total</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
