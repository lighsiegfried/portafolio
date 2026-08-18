import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/mini-erp/components/ui/dialog';
import { Button } from '@/mini-erp/components/ui/button';
import { Input } from '@/mini-erp/components/ui/input';
import { Label } from '@/mini-erp/components/ui/label';
import { Textarea } from '@/mini-erp/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/mini-erp/components/ui/select';
import * as invApi from '../../../services/inventoryApi';
import { formatNumber } from '../../utils/formatters';
import useErpTranslation from '../../i18n/useErpTranslation';

const EMPTY = { productId: '', type: 'IN', quantity: 1, reference: '', notes: '' };

/**
 * Render a `{stock}` template keeping the number in its own tabular-nums span.
 * @param {string} template dictionary string containing `{stock}`
 * @param {string} value already formatted number
 */
function withStockNode(template, value) {
  const [before, after = ''] = String(template).split('{stock}');
  return (
    <>
      {before}
      <span className="tabular-nums">{value}</span>
      {after}
    </>
  );
}

/**
 * Register an inventory movement. Outbound (OUT) movements require an explicit
 * confirmation step that previews the resulting stock and blocks oversell
 * client-side (the backend re-validates atomically as the source of truth).
 */
export default function MovementFormDialog({ open, onOpenChange, products, onCreated }) {
  const { te } = useErpTranslation();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setError('');
      setConfirmOpen(false);
    }
  }, [open]);

  const product = useMemo(
    () => products.find((p) => p.id === form.productId) || null,
    [products, form.productId]
  );

  const quantity = Number(form.quantity) || 0;
  const isOut = form.type === 'OUT';
  const resultingStock = product ? product.stock + (isOut ? -quantity : quantity) : null;
  const insufficient = isOut && product && resultingStock < 0;

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    if (!form.productId) return te.inventory.form.errors.productRequired;
    if (!quantity || quantity <= 0) return te.inventory.form.errors.quantityPositive;
    if (!form.reference.trim()) return te.inventory.form.errors.referenceRequired;
    if (insufficient) return te.inventory.form.errors.insufficientStock;
    return '';
  }

  function handleSubmit(e) {
    e.preventDefault();
    const msg = validate();
    if (msg) { setError(msg); return; }
    setError('');
    if (isOut) {
      setConfirmOpen(true); // outbound requires confirmation
    } else {
      doCreate();
    }
  }

  async function doCreate() {
    setSubmitting(true);
    setError('');
    try {
      await invApi.createMovement({
        productId: form.productId,
        type: form.type,
        quantity,
        reference: form.reference.trim(),
        notes: form.notes.trim() || undefined,
      });
      toast.success(isOut ? te.toast.movementOutCreated : te.toast.movementInCreated);
      setConfirmOpen(false);
      onOpenChange(false);
      onCreated();
    } catch (err) {
      const message = err.message || te.errors.createMovement;
      setError(message);
      toast.error(message);
      setConfirmOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{te.inventory.form.title}</DialogTitle>
            <DialogDescription>{te.inventory.form.description}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-red-600 dark:text-red-300">
                {error}
              </p>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="mov-product">{te.inventory.form.product}</Label>
              <Select value={form.productId} onValueChange={(v) => set('productId', v)}>
                <SelectTrigger id="mov-product">
                  <SelectValue placeholder={te.inventory.form.productPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {te.inventory.form.productOption
                        .replace('{sku}', p.sku)
                        .replace('{name}', p.name)
                        .replace('{stock}', formatNumber(p.stock))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="mov-type">{te.inventory.form.type}</Label>
                <Select value={form.type} onValueChange={(v) => set('type', v)}>
                  <SelectTrigger id="mov-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">{te.inventory.form.typeIn}</SelectItem>
                    <SelectItem value="OUT">{te.inventory.form.typeOut}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mov-qty">{te.inventory.form.quantity}</Label>
                <Input
                  id="mov-qty"
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => set('quantity', e.target.value)}
                />
              </div>
            </div>

            {product && (
              <p className={`text-xs ${insufficient ? 'text-red-600 dark:text-red-300' : 'text-muted-foreground'}`}>
                {withStockNode(te.inventory.form.currentStock, formatNumber(product.stock))}
                {quantity > 0 && (
                  <>{' → '}{withStockNode(te.inventory.form.resultingStock, formatNumber(resultingStock))}</>
                )}
                {insufficient && ` ${te.inventory.form.insufficientSuffix}`}
              </p>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="mov-ref">{te.inventory.form.reference}</Label>
              <Input
                id="mov-ref"
                value={form.reference}
                onChange={(e) => set('reference', e.target.value)}
                placeholder={te.inventory.form.referencePlaceholder}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mov-notes">{te.inventory.form.notes}</Label>
              <Textarea id="mov-notes" rows={2} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                {te.common.cancel}
              </Button>
              <Button type="submit" disabled={submitting || insufficient}>
                {isOut
                  ? te.inventory.form.continue
                  : submitting
                    ? te.inventory.form.submitting
                    : te.inventory.form.submitIn}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Outbound confirmation */}
      <Dialog open={confirmOpen} onOpenChange={(o) => { if (!o) setConfirmOpen(false); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-red-600 dark:text-red-300" aria-hidden="true" />
              {te.inventory.confirm.title}
            </DialogTitle>
            <DialogDescription>
              {te.inventory.confirm.description}
            </DialogDescription>
          </DialogHeader>

          {product && (
            <div className="space-y-1.5 rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">{te.inventory.confirm.product}</span><span className="text-foreground">{product.sku} · {product.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{te.inventory.confirm.quantity}</span><span className="tabular-nums text-red-600 dark:text-red-300">-{formatNumber(quantity)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{te.inventory.confirm.resultingStock}</span><span className="tabular-nums font-medium text-foreground">{formatNumber(resultingStock)}</span></div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)} disabled={submitting}>
              {te.common.cancel}
            </Button>
            <Button type="button" variant="destructive" onClick={doCreate} disabled={submitting || insufficient}>
              {submitting ? te.inventory.confirm.submitting : te.inventory.confirm.submit}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
