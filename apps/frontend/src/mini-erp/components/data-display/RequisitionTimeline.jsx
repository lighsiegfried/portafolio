import { Check, X } from 'lucide-react';
import { cn } from '@/mini-erp/lib/utils';
import { timelineSteps } from '../../config/requisitions';

/**
 * Horizontal progress indicator for the requisition workflow.
 * pending -> approved -> completed, with a rejected branch.
 */
export default function RequisitionTimeline({ status }) {
  const steps = timelineSteps(status);

  return (
    <ol className="flex items-center">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const rejected = step.state === 'rejected';
        const done = step.state === 'done';
        const current = step.state === 'current';

        return (
          <li key={step.key} className={cn('flex items-center', !isLast && 'flex-1')}>
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  'flex size-7 items-center justify-center rounded-full border text-xs font-semibold',
                  rejected && 'border-red-500/40 bg-red-500/20 text-red-300',
                  done && 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300',
                  current && 'border-blue-500/40 bg-blue-500/20 text-blue-300',
                  step.state === 'todo' && 'border-border bg-muted/40 text-muted-foreground'
                )}
              >
                {rejected ? <X className="size-4" /> : done ? <Check className="size-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  'text-[11px]',
                  rejected ? 'text-red-300' : current ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <span
                className={cn(
                  'mx-2 mb-5 h-px flex-1',
                  done ? 'bg-emerald-500/40' : rejected ? 'bg-red-500/40' : 'bg-border'
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
