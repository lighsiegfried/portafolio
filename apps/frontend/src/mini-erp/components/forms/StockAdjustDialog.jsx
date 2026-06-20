import { useState, useEffect } from 'react';
import { toast } from 'sonner';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/mini-erp/components/ui/select';
import * as api from '../../../services/productsApi';

/**
 * Stock adjustment dialog — replaces the old prompt() flow.
 * Uses the existing /products/:id/stock endpoint (IN/OUT movement).
 */
export default function StockAdjustDialog({ open, onOpenChange, product, onSaved }) {
  const [type, setType] = useState('IN');
  const [quantity, setQuantity] = useState(1);
  const [reference, setReference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setType('IN');
      setQuantity(1);
      setReference('');
      setError('');
    }
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.updateStock(product.id, { type, quantity: qty, reference: reference.trim() || 'Ajuste de stock' });
      toast.success(`Stock actualizado (${type})`);
      onOpenChange(false);
      onSaved();
    } catch (err) {
      const message = err.message || 'Error al ajustar stock';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajustar stock</DialogTitle>
          <DialogDescription>
            {product.name} · stock actual: {product.stock}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="stock-type">Tipo</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="stock-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN">Entrada (IN)</SelectItem>
                  <SelectItem value="OUT">Salida (OUT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stock-qty">Cantidad</Label>
              <Input
                id="stock-qty"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="stock-ref">Referencia</Label>
            <Input
              id="stock-ref"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ej: Compra proveedor"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Guardando...' : 'Registrar ajuste'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
