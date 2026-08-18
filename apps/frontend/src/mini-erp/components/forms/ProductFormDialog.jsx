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
import { Textarea } from '@/mini-erp/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/mini-erp/components/ui/select';
import * as api from '../../../services/productsApi';
import useErpTranslation from '../../i18n/useErpTranslation';

/**
 * Category values are the backend contract; the `label` here is the untranslated
 * fallback. Prefer `te.products.categories[value]` (or `categoryLabel(value, te)`)
 * for anything user-visible.
 */
export const PRODUCT_CATEGORIES = [
  { value: 'insumo', label: 'Insumo' },
  { value: 'materia_prima', label: 'Materia Prima' },
  { value: 'equipo', label: 'Equipo' },
  { value: 'servicio', label: 'Servicio' },
  { value: 'oficina', label: 'Oficina' },
];

/**
 * @param {string} value category value
 * @param {object} [te] optional ERP dictionary from `useErpTranslation()`
 * @returns {string} localized label when `te` is provided, else the static label
 */
export function categoryLabel(value, te) {
  const localized = te?.products?.categories?.[value];
  if (localized) return localized;
  const found = PRODUCT_CATEGORIES.find((c) => c.value === value);
  return found ? found.label : value;
}

const EMPTY = { sku: '', name: '', category: 'insumo', unit: 'unidad', price: 0, minStock: 0, initialStock: 0, description: '' };

/**
 * Create/edit product dialog. `product` null -> create; otherwise edit.
 * SKU is immutable on edit (identifier); backend enforces SKU uniqueness on create.
 */
export default function ProductFormDialog({ open, onOpenChange, product, onSaved }) {
  const { te } = useErpTranslation();
  const isEdit = Boolean(product);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setError('');
    if (product) {
      setForm({
        sku: product.sku || '',
        name: product.name || '',
        category: product.category || 'insumo',
        unit: product.unit || 'unidad',
        price: product.price ?? 0,
        minStock: product.minStock ?? 0,
        initialStock: 0,
        description: product.description || '',
      });
    } else {
      setForm(EMPTY);
    }
  }, [open, product]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || (!isEdit && !form.sku.trim())) {
      setError(te.products.form.errors.required);
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      if (isEdit) {
        await api.update(product.id, {
          name: form.name.trim(),
          description: form.description.trim(),
          category: form.category,
          unit: form.unit.trim(),
          price: Number(form.price) || 0,
          minStock: Number(form.minStock) || 0,
        });
        toast.success(te.toast.productUpdated);
      } else {
        await api.create({
          sku: form.sku.trim(),
          name: form.name.trim(),
          description: form.description.trim(),
          category: form.category,
          unit: form.unit.trim(),
          price: Number(form.price) || 0,
          minStock: Number(form.minStock) || 0,
          initialStock: Number(form.initialStock) || 0,
        });
        toast.success(te.toast.productCreated);
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      const message = err.message || te.errors.saveProduct;
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? te.products.form.editTitle : te.products.form.createTitle}</DialogTitle>
          <DialogDescription>
            {isEdit ? te.products.form.editDescription : te.products.form.createDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-red-600 dark:text-red-300">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="product-sku">{te.products.form.sku}</Label>
              <Input
                id="product-sku"
                value={form.sku}
                onChange={(e) => set('sku', e.target.value)}
                disabled={isEdit}
                placeholder={te.products.form.skuPlaceholder}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="product-unit">{te.products.form.unit}</Label>
              <Input id="product-unit" value={form.unit} onChange={(e) => set('unit', e.target.value)} placeholder={te.products.form.unitPlaceholder} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="product-name">{te.products.form.name}</Label>
            <Input id="product-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder={te.products.form.namePlaceholder} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="product-category">{te.products.form.category}</Label>
              <Select value={form.category} onValueChange={(v) => set('category', v)}>
                <SelectTrigger id="product-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{categoryLabel(c.value, te)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="product-price">{te.products.form.price}</Label>
              <Input
                id="product-price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="product-minstock">{te.products.form.minStock}</Label>
              <Input
                id="product-minstock"
                type="number"
                min="0"
                value={form.minStock}
                onChange={(e) => set('minStock', e.target.value)}
              />
            </div>
            {!isEdit && (
              <div className="space-y-1.5">
                <Label htmlFor="product-initialstock">{te.products.form.initialStock}</Label>
                <Input
                  id="product-initialstock"
                  type="number"
                  min="0"
                  value={form.initialStock}
                  onChange={(e) => set('initialStock', e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="product-description">{te.products.form.description}</Label>
            <Textarea
              id="product-description"
              rows={2}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder={te.products.form.descriptionPlaceholder}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {te.common.cancel}
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting
                ? te.products.form.submitting
                : isEdit
                  ? te.products.form.submitEdit
                  : te.products.form.submitCreate}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
