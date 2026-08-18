import { useMemo } from 'react';
import LeadCard from './LeadCard';
import { LEAD_STAGES } from '../../config/leads';
import { formatCurrency } from '../../utils/formatters';
import useErpTranslation from '../../i18n/useErpTranslation';

/** Kanban pipeline: one column per lead status. */
export default function LeadsBoard({ leads, canManage, onOpen, onMove }) {
  const { te } = useErpTranslation();

  const grouped = useMemo(() => {
    const map = Object.fromEntries(LEAD_STAGES.map((s) => [s.status, []]));
    for (const lead of leads) {
      if (map[lead.status]) map[lead.status].push(lead);
      else (map[lead.status] = [lead]);
    }
    return map;
  }, [leads]);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {LEAD_STAGES.map((stage) => {
        const items = grouped[stage.status] || [];
        const total = items.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
        return (
          <div key={stage.status} className="flex w-72 shrink-0 flex-col">
            <div className="mb-2 flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className={`size-2.5 rounded-full ${stage.dot}`} aria-hidden="true" />
                <span className="text-sm font-medium text-foreground">
                  {te.status.lead[stage.status] || stage.label}
                </span>
                <span className="text-xs text-muted-foreground">{items.length}</span>
              </div>
              {total > 0 && <span className="text-[11px] text-muted-foreground">{formatCurrency(total)}</span>}
            </div>

            <div className="flex flex-1 flex-col gap-2">
              {items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-muted/20 px-3 py-8 text-center text-xs text-muted-foreground">
                  {te.leads.board.emptyStage}
                </div>
              ) : (
                items.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} canManage={canManage} onOpen={onOpen} onMove={onMove} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
