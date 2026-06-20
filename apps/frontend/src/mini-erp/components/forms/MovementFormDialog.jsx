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

const EMPTY = { productId: '', type: 'IN', quantity: 1, reference: '', notes: '' };

/**
 * Register an inventory movement. Outbound (OUT) movements require an explicit
 * confirmation step that previews the resulting stock and blocks oversell
 * client-side (the backend re-validates atomically as the source of truth).
 */
export default function MovementFormDialog({ open, onOpenChange, products, onCreated }) {
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
    if (!form.productId) return 'Seleccione un producto';
    if (!quantity || quantity <= 0) return 'La cantidad debe ser mayor a 0';
    if (!form.reference.trim()) return 'La referencia es requerida';
    if (insufficient) return 'Stock insuficiente para realizar la salida';
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
      toast.success(isOut ? 'Salida registrada' : 'Entrada registrada');
      setConfirmOpen(false);
      onOpenChange(false);
      onCreated();
    } catch (err) {
      const message = err.message || 'Error al registrar el movimiento';
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
            <DialogTitle>Registrar movimiento</DialogTitle>
            <DialogDescription>Entrada o salida de stock para un producto.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-red-300">
                {error}
              </p>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="mov-product">Producto</Label>
              <Select value={form.productId} onValueChange={(v) => set('productId', v)}>
                <SelectTrigger id="mov-product">
                  <SelectValue placeholder="Seleccionar producto..." />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.sku} · {p.name} (stock: {formatNumber(p.stock)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="mov-type">Tipo</Label>
                <Select value={form.type} onValueChange={(v) => set('type', v)}>
                  <SelectTrigger id="mov-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">Entrada (IN)</SelectItem>
                    <SelectItem value="OUT">Salida (OUT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mov-qty">Cantidad</Label>
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
              <p className={`text-xs ${insufficient ? 'text-red-300' : 'text-muted-foreground'}`}>
                Stock actual: <span className="tabular-nums">{formatNumber(product.stock)}</span>
                {quantity > 0 && (
                  <> → resultante: <span className="tabular-nums">{formatNumber(resultingStock)}</span></>
                )}
                {insufficient && ' · stock insuficiente'}
              </p>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="mov-ref">Referencia</Label>
              <Input
                id="mov-ref"
                value={form.reference}
                onChange={(e) => set('reference', e.target.value)}
                placeholder="Ej: Compra proveedor, ajuste, venta..."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mov-notes">Notas (opcional)</Label>
              <Textarea id="mov-notes" rows={2} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting || insufficient}>
                {isOut ? 'Continuar' : submitting ? 'Registrando...' : 'Registrar entrada'}
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
              <AlertTriangle className="size-5 text-red-300" />
              Confirmar salida de stock
            </DialogTitle>
            <DialogDescription>
              Esta acción reducirá el stock disponible y no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          {product && (
            <div className="space-y-1.5 rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Producto</span><span className="text-foreground">{product.sku} · {product.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Cantidad de salida</span><span className="tabular-nums text-red-300">-{formatNumber(quantity)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Stock resultante</span><span className="tabular-nums font-medium text-foreground">{formatNumber(resultingStock)}</span></div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={doCreate} disabled={submitting || insufficient}>
              {submitting ? 'Registrando...' : 'Confirmar salida'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
