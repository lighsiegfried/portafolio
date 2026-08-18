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
import useErpTranslation from '../../i18n/useErpTranslation';

const emptyItem = () => ({ productName: '', quantity: 1, unit: 'unidad', estimatedCost: 0 });

/**
 * Create requisition dialog. Enforces the backend contract client-side:
 * title + description are required (backend rejects an empty description), and
 * every item needs productName, unit, quantity > 0 and estimatedCost >= 0.
 */
export default function RequisitionFormDialog({ open, onOpenChange, onCreated }) {
  const { te } = useErpTranslation();
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
    if (!title.trim()) { setError(te.requisitions.form.errors.titleRequired); return; }
    if (!description.trim()) { setError(te.requisitions.form.errors.descriptionRequired); return; }

    const validItems = items
      .filter((it) => it.productName.trim())
      .map((it) => ({
        productName: it.productName.trim(),
        quantity: Number(it.quantity) || 0,
        unit: (it.unit || '').trim() || 'unidad',
        estimatedCost: Number(it.estimatedCost) || 0,
      }));

    if (validItems.length === 0) { setError(te.requisitions.form.errors.itemsRequired); return; }
    if (validItems.some((it) => it.quantity <= 0)) { setError(te.requisitions.form.errors.quantityPositive); return; }
    if (validItems.some((it) => it.estimatedCost < 0)) { setError(te.requisitions.form.errors.costNonNegative); return; }

    setSubmitting(true);
    setError('');
    try {
      await api.create({ title: title.trim(), description: description.trim(), items: validItems });
      toast.success(te.toast.requisitionCreated);
      onOpenChange(false);
      onCreated();
    } catch (err) {
      const message = err.message || te.errors.createRequisition;
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
          <DialogTitle>{te.requisitions.form.title}</DialogTitle>
          <DialogDescription>{te.requisitions.form.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-red-600 dark:text-red-300">
              {error}
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="req-title">{te.requisitions.form.titleLabel}</Label>
            <Input id="req-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={te.requisitions.form.titlePlaceholder} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="req-desc">{te.requisitions.form.descriptionLabel}</Label>
            <Textarea id="req-desc" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={te.requisitions.form.descriptionPlaceholder} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{te.requisitions.form.items}</Label>
              <span className="text-xs text-muted-foreground">
                {te.requisitions.form.estimatedTotal.replace('{total}', formatCurrency(estimatedTotal))}
              </span>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_4rem_3.5rem_6rem_1.75rem] gap-2 px-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                <span>{te.requisitions.form.columns.product}</span>
                <span>{te.requisitions.form.columns.quantity}</span>
                <span>{te.requisitions.form.columns.unit}</span>
                <span className="text-right">{te.requisitions.form.columns.cost}</span>
                <span />
              </div>
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-[1fr_4rem_3.5rem_6rem_1.75rem] items-center gap-2">
                  <Input value={item.productName} onChange={(e) => updateItem(i, 'productName', e.target.value)} placeholder={te.requisitions.form.productPlaceholder} aria-label={te.requisitions.form.columns.product} className="h-8 text-xs" />
                  <Input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)} aria-label={te.requisitions.form.columns.quantity} className="h-8 text-xs" />
                  <Input value={item.unit} onChange={(e) => updateItem(i, 'unit', e.target.value)} aria-label={te.requisitions.form.columns.unit} className="h-8 text-xs" />
                  <Input type="number" min="0" step="0.01" value={item.estimatedCost} onChange={(e) => updateItem(i, 'estimatedCost', e.target.value)} aria-label={te.requisitions.form.columns.cost} className="h-8 text-right text-xs" />
                  <Button type="button" variant="ghost" size="icon" aria-label={te.requisitions.form.removeItem} className="size-8 text-muted-foreground hover:text-red-600 dark:hover:text-red-300" onClick={() => removeItem(i)} disabled={items.length <= 1}>
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </div>

            <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1.5">
              <Plus className="size-4" aria-hidden="true" />
              {te.requisitions.form.addItem}
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              {te.common.cancel}
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? te.requisitions.form.submitting : te.requisitions.form.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
