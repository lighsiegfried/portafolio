import { Card } from '@/mini-erp/components/ui/card';
import { cn } from '@/mini-erp/lib/utils';

/**
 * Accent tints. The 500/15 wash reads on both a white and a near-black surface;
 * the foreground shade flips so the icon keeps contrast in either theme.
 */
const ACCENTS = {
  violet: 'bg-violet-500/15 text-violet-600 dark:text-violet-300',
  yellow: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300',
  red: 'bg-red-500/15 text-red-600 dark:text-red-300',
  green: 'bg-green-500/15 text-green-700 dark:text-green-300',
  cyan: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300',
  blue: 'bg-blue-500/15 text-blue-600 dark:text-blue-300',
};

/**
 * Premium KPI card. Static value only — the dashboard contract has no historical
 * data, so there are intentionally no trend arrows.
 *
 * `label` / `hint` arrive already localized from the calling page.
 */
export default function KpiCard({ label, value, icon: Icon, accent = 'violet', hint, onClick }) {
  const tint = ACCENTS[accent] || ACCENTS.violet;
  const clickable = typeof onClick === 'function';

  return (
    <Card
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        'flex items-start justify-between gap-3 p-5 transition-colors',
        clickable &&
          'cursor-pointer hover:border-violet-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      )}
    >
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-1 truncate text-2xl font-bold text-foreground">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      {Icon && (
        <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg', tint)}>
          <Icon className="size-5" aria-hidden="true" />
        </div>
      )}
    </Card>
  );
}
