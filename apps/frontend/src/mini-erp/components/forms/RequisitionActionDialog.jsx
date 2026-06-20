import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/mini-erp/components/ui/dialog';
import { Button } from '@/mini-erp/components/ui/button';
import { Label } from '@/mini-erp/components/ui/label';
import { Textarea } from '@/mini-erp/components/ui/textarea';

const INTENT_VARIANT = {
  primary: 'default',
  success: 'default',
  danger: 'destructive',
};

/**
 * Confirmation dialog for a state-changing requisition action.
 * For `reject` (action.requiresReason) it collects a mandatory reason.
 *
 * Props:
 *  - action: a REQ_ACTIONS entry (or null when closed)
 *  - requisition: the target requisition (for the title/number)
 *  - submitting: disables the confirm button while the request is in flight
 *  - onConfirm(reason): runs the action; reason is undefined unless required
 *  - onClose()
 */
export default function RequisitionActionDialog({ action, requisition, submitting, onConfirm, onClose }) {
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setReason('');
    setTouched(false);
  }, [action, requisition]);

  const open = Boolean(action && requisition);
  if (!open) return null;

  const requiresReason = action.requiresReason;
  const reasonInvalid = requiresReason && !reason.trim();

  function handleConfirm() {
    if (reasonInvalid) {
      setTouched(true);
      return;
    }
    onConfirm(requiresReason ? reason.trim() : undefined);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{action.confirmTitle}</DialogTitle>
          <DialogDescription>
            {requisition.number ? `${requisition.number} · ` : ''}{requisition.title}
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">{action.confirmBody}</p>

        {requiresReason && (
          <div className="space-y-1.5">
            <Label htmlFor="reject-reason">Motivo de rechazo</Label>
            <Textarea
              id="reject-reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Explica por qué se rechaza la requisición..."
              autoFocus
            />
            {touched && reasonInvalid && (
              <p className="text-xs text-red-300">El motivo es requerido para rechazar.</p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant={INTENT_VARIANT[action.intent] || 'default'}
            onClick={handleConfirm}
            disabled={submitting || reasonInvalid}
          >
            {submitting ? 'Procesando...' : action.label}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
