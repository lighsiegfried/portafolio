import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { cn } from '@/mini-erp/lib/utils';
import { MOVEMENT_TYPES } from '../../config/inventory';

/** Inbound (IN) / outbound (OUT) movement badge. */
export default function MovementTypeBadge({ type }) {
  const cfg = MOVEMENT_TYPES[type];
  if (!cfg) return <span className="text-xs text-muted-foreground">{type}</span>;
  const Icon = type === 'IN' ? ArrowDownLeft : ArrowUpRight;
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium', cfg.badge)}>
      <Icon className="size-3" />
      {cfg.label}
    </span>
  );
}
