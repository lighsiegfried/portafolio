import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/mini-erp/components/ui/card';
import { Skeleton } from '@/mini-erp/components/ui/skeleton';
import EmptyState from '../EmptyState';
import ErrorState from '../ErrorState';
import { list as fetchLeads } from '../../../services/leadsApi';
import { formatNumber } from '../../utils/formatters';
import useErpTranslation from '../../i18n/useErpTranslation';

/** Stage order + bar colors. Labels come from `status.lead.*` at render time. */
const STAGES = [
  { key: 'new', color: 'bg-cyan-500' },
  { key: 'in_contact', color: 'bg-indigo-500' },
  { key: 'negotiation', color: 'bg-violet-500' },
  { key: 'won', color: 'bg-emerald-500' },
  { key: 'lost', color: 'bg-gray-500 dark:bg-gray-400' },
];

/**
 * CRM pipeline overview. Rendered only for roles with `viewLeads` (gated by the
 * parent). Aggregates the existing /leads list client-side into stage counts and
 * renders lightweight CSS bars (no chart library). Isolated fetch + states.
 */
export default function CrmPipeline() {
  const { te } = useErpTranslation();
  const [counts, setCounts] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  // `error` holds `{ message }` so the localized fallback resolves at render time
  // (keeping `load` free of dictionary deps, so switching language never refetches).
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
      setError({ message: err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const max = counts ? Math.max(1, ...STAGES.map((s) => counts[s.key])) : 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{te.dashboard.pipeline.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {STAGES.map((s) => <Skeleton key={s.key} className="h-7 w-full" />)}
          </div>
        ) : error ? (
          <ErrorState message={error.message || te.errors.loadLeads} onRetry={load} />
        ) : total === 0 ? (
          <EmptyState message={te.dashboard.pipeline.empty} />
        ) : (
          <div className="space-y-3">
            {STAGES.map((s) => {
              const value = counts[s.key];
              const width = `${(value / max) * 100}%`;
              return (
                <div key={s.key}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{te.status.lead[s.key] || s.key}</span>
                    <span className="font-medium text-foreground">{formatNumber(value)}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width }} />
                  </div>
                </div>
              );
            })}
            <p className="pt-1 text-xs text-muted-foreground">
              {te.dashboard.pipeline.totalHint.replace('{count}', formatNumber(total))}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
