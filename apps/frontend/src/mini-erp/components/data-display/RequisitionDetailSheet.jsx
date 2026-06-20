import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/mini-erp/components/ui/sheet';
import { Button } from '@/mini-erp/components/ui/button';
import { Separator } from '@/mini-erp/components/ui/separator';
import StatusBadge from '../StatusBadge';
import RequisitionTimeline from './RequisitionTimeline';
import { allowedActions, itemName, itemsTotal, PRIORITY_STYLES } from '../../config/requisitions';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { cn } from '@/mini-erp/lib/utils';

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right text-foreground">{children}</span>
    </div>
  );
}

const INTENT_CLASS = {
  primary: 'bg-blue-500/80 hover:bg-blue-500 text-white',
  success: 'bg-emerald-500/80 hover:bg-emerald-500 text-white',
  danger: 'bg-red-500/80 hover:bg-red-500 text-white',
};

/**
 * Requisition detail sheet: workflow timeline, summary, items table and the
 * contextual actions allowed for the current status + user role. Actions are
 * derived from the shared workflow config so the sheet can only ever surface
 * valid transitions; the action itself is confirmed in a separate dialog.
 */
export default function RequisitionDetailSheet({ open, onOpenChange, requisition, user, onAction }) {
  if (!requisition) return null;

  const req = requisition;
  const items = Array.isArray(req.items) ? req.items : [];
  const actions = allowedActions(req, user);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-lg">
        <SheetHeader className="space-y-2">
          <SheetTitle className="truncate">{req.title}</SheetTitle>
          <SheetDescription className="flex items-center gap-2">
            <span className="font-mono text-xs text-violet-300">{req.number}</span>
            <StatusBadge status={req.status} />
          </SheetDescription>
        </SheetHeader>

        <div className="mt-5 rounded-xl border border-border bg-muted/20 p-4">
          <RequisitionTimeline status={req.status} />
        </div>

        <div className="mt-4">
          <Row label="Prioridad">
            <span className={cn('font-medium capitalize', PRIORITY_STYLES[req.priority] || 'text-foreground')}>
              {req.priority || '-'}
            </span>
          </Row>
          {req.department && <Row label="Departamento"><span className="capitalize">{req.department}</span></Row>}
          <Row label="Creada por"><span className="font-mono text-xs">{(req.createdBy || '-').slice(0, 8)}</span></Row>
          {req.approvedBy && <Row label="Aprobada por"><span className="font-mono text-xs">{req.approvedBy.slice(0, 8)}</span></Row>}
          {req.completedBy && <Row label="Completada por"><span className="font-mono text-xs">{req.completedBy.slice(0, 8)}</span></Row>}
          <Row label="Costo estimado"><span className="font-semibold text-emerald-300">{formatCurrency(itemsTotal(req))}</span></Row>
          <Row label="Creada">{formatDate(req.createdAt)}</Row>
        </div>

        {(req.notes || req.description) && (
          <>
            <Separator className="my-4" />
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Notas</p>
              <p className="text-sm text-foreground">{req.notes || req.description}</p>
            </div>
          </>
        )}

        {req.rejectionReason && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
            <p className="text-xs font-medium uppercase tracking-wider text-red-300">Motivo de rechazo</p>
            <p className="mt-1 text-sm text-red-200">{req.rejectionReason}</p>
          </div>
        )}

        <Separator className="my-4" />
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Ítems ({items.length})
          </p>
          {items.length === 0 ? (
            <p className="py-3 text-center text-xs text-muted-foreground">Sin ítems registrados</p>
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
              {items.map((it, i) => (
                <li key={it.id || i} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                  <div className="min-w-0">
                    <p className="truncate text-foreground">{itemName(it)}</p>
                    {it.observations && <p className="truncate text-xs text-muted-foreground">{it.observations}</p>}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="tabular-nums text-foreground">
                      {it.quantity}{it.unit ? ` ${it.unit}` : ''}
                    </p>
                    <p className="text-xs tabular-nums text-muted-foreground">{formatCurrency(it.estimatedCost)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {actions.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="flex flex-wrap gap-2">
              {actions.map((action) => (
                <Button
                  key={action.key}
                  className={cn('flex-1', INTENT_CLASS[action.intent])}
                  onClick={() => onAction(req, action)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
