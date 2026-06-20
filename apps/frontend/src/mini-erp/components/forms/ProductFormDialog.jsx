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

export const PRODUCT_CATEGORIES = [
  { value: 'insumo', label: 'Insumo' },
  { value: 'materia_prima', label: 'Materia Prima' },
  { value: 'equipo', label: 'Equipo' },
  { value: 'servicio', label: 'Servicio' },
  { value: 'oficina', label: 'Oficina' },
];

export function categoryLabel(value) {
  const found = PRODUCT_CATEGORIES.find((c) => c.value === value);
  return found ? found.label : value;
}

const EMPTY = { sku: '', name: '', category: 'insumo', unit: 'unidad', price: 0, minStock: 0, initialStock: 0, description: '' };

/**
 * Create/edit product dialog. `product` null -> create; otherwise edit.
 * SKU is immutable on edit (identifier); backend enforces SKU uniqueness on create.
 */
export default function ProductFormDialog({ open, onOpenChange, product, onSaved }) {
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
      setError('SKU y nombre son requeridos');
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
        toast.success('Producto actualizado');
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
        toast.success('Producto creado');
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      const message = err.message || 'Error al guardar el producto';
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
          <DialogTitle>{isEdit ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Actualiza los datos del producto.' : 'Registra un nuevo producto en el catálogo.'}
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
              <Label htmlFor="product-sku">SKU</Label>
              <Input
                id="product-sku"
                value={form.sku}
                onChange={(e) => set('sku', e.target.value)}
                disabled={isEdit}
                placeholder="INS-001"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="product-unit">Unidad</Label>
              <Input id="product-unit" value={form.unit} onChange={(e) => set('unit', e.target.value)} placeholder="unidad" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="product-name">Nombre</Label>
            <Input id="product-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Nombre del producto" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="product-category">Categoría</Label>
              <Select value={form.category} onValueChange={(v) => set('category', v)}>
                <SelectTrigger id="product-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="product-price">Precio</Label>
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
              <Label htmlFor="product-minstock">Stock mínimo</Label>
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
                <Label htmlFor="product-initialstock">Stock inicial</Label>
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
            <Label htmlFor="product-description">Descripción</Label>
            <Textarea
              id="product-description"
              rows={2}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Opcional"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
