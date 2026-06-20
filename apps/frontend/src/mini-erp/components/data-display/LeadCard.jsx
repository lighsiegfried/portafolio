import { MoreVertical, CalendarClock, StickyNote } from 'lucide-react';
import { Card } from '@/mini-erp/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/mini-erp/components/ui/dropdown-menu';
import { cn } from '@/mini-erp/lib/utils';
import { LEAD_STAGES, leadCompany, leadContact, isFollowUpOverdue } from '../../config/leads';
import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * Kanban lead card. Click opens the detail sheet; the menu moves the lead to
 * another stage (dependency-light status transition — no drag-and-drop dep).
 */
export default function LeadCard({ lead, canManage, onOpen, onMove }) {
  const noteCount = Array.isArray(lead.notes) ? lead.notes.length : 0;
  const overdue = isFollowUpOverdue(lead);

  return (
    <Card
      onClick={() => onOpen(lead)}
      className="cursor-pointer space-y-2 p-3 transition-colors hover:border-violet-500/40"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{leadCompany(lead)}</p>
          <p className="truncate text-xs text-muted-foreground">{leadContact(lead)}</p>
        </div>
        {canManage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                <MoreVertical className="size-4" />
                <span className="sr-only">Mover lead</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuLabel>Mover a</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {LEAD_STAGES.filter((s) => s.status !== lead.status).map((s) => (
                <DropdownMenuItem key={s.status} onClick={() => onMove(lead, s.status)}>
                  <span className={cn('size-2 rounded-full', s.dot)} />
                  {s.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {lead.estimatedValue != null && (
        <p className="text-sm font-semibold text-emerald-300">{formatCurrency(lead.estimatedValue)}</p>
      )}

      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        {lead.nextFollowUp && (
          <span className={cn('inline-flex items-center gap-1', overdue && 'text-red-300')}>
            <CalendarClock className="size-3" />
            {formatDate(lead.nextFollowUp)}
          </span>
        )}
        {noteCount > 0 && (
          <span className="inline-flex items-center gap-1">
            <StickyNote className="size-3" />
            {noteCount}
          </span>
        )}
      </div>
    </Card>
  );
}
