import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
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
import * as api from '../../../services/requisitionsApi';
import { formatCurrency } from '../../utils/formatters';

const emptyItem = () => ({ productName: '', quantity: 1, unit: 'unidad', estimatedCost: 0 });

/**
 * Create requisition dialog. Enforces the backend contract client-side:
 * title + description are required (backend rejects an empty description), and
 * every item needs productName, unit, quantity > 0 and estimatedCost >= 0.
 */
export default function RequisitionFormDialog({ open, onOpenChange, onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([emptyItem()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle('');
      setDescription('');
      setItems([emptyItem()]);
      setError('');
    }
  }, [open]);

  const estimatedTotal = items.reduce((sum, it) => sum + (Number(it.estimatedCost) || 0), 0);

  function updateItem(i, field, value) {
    setItems((list) => list.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)));
  }

  function addItem() {
    setItems((list) => [...list, emptyItem()]);
  }

  function removeItem(i) {
    setItems((list) => (list.length <= 1 ? list : list.filter((_, idx) => idx !== i)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) { setError('El título es requerido'); return; }
    if (!description.trim()) { setError('La descripción es requerida'); return; }

    const validItems = items
      .filter((it) => it.productName.trim())
      .map((it) => ({
        productName: it.productName.trim(),
        quantity: Number(it.quantity) || 0,
        unit: (it.unit || '').trim() || 'unidad',
        estimatedCost: Number(it.estimatedCost) || 0,
      }));

    if (validItems.length === 0) { setError('Agregue al menos un ítem con nombre de producto'); return; }
    if (validItems.some((it) => it.quantity <= 0)) { setError('La cantidad de cada ítem debe ser mayor a 0'); return; }
    if (validItems.some((it) => it.estimatedCost < 0)) { setError('El costo estimado no puede ser negativo'); return; }

    setSubmitting(true);
    setError('');
    try {
      await api.create({ title: title.trim(), description: description.trim(), items: validItems });
      toast.success('Requisición creada');
      onOpenChange(false);
      onCreated();
    } catch (err) {
      const message = err.message || 'Error al crear la requisición';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nueva requisición</DialogTitle>
          <DialogDescription>Registra una solicitud de compra. Iniciará en estado "Pendiente".</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="req-title">Título</Label>
            <Input id="req-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Compra de insumos" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="req-desc">Descripción</Label>
            <Textarea id="req-desc" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalle de la solicitud" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Ítems</Label>
              <span className="text-xs text-muted-foreground">Total estimado: {formatCurrency(estimatedTotal)}</span>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_4rem_3.5rem_6rem_1.75rem] gap-2 px-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                <span>Producto</span>
                <span>Cant.</span>
                <span>Unidad</span>
                <span className="text-right">Costo</span>
                <span />
              </div>
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-[1fr_4rem_3.5rem_6rem_1.75rem] items-center gap-2">
                  <Input value={item.productName} onChange={(e) => updateItem(i, 'productName', e.target.value)} placeholder="Producto" className="h-8 text-xs" />
                  <Input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)} className="h-8 text-xs" />
                  <Input value={item.unit} onChange={(e) => updateItem(i, 'unit', e.target.value)} className="h-8 text-xs" />
                  <Input type="number" min="0" step="0.01" value={item.estimatedCost} onChange={(e) => updateItem(i, 'estimatedCost', e.target.value)} className="h-8 text-right text-xs" />
                  <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-red-300" onClick={() => removeItem(i)} disabled={items.length <= 1}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1.5">
              <Plus className="size-4" />
              Agregar ítem
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creando...' : 'Crear requisición'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
