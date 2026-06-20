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
import * as api from '../../../services/leadsApi';
import { LEAD_SOURCES } from '../../config/leads';

const EMPTY = { companyName: '', contactName: '', email: '', phone: '', source: 'web', nextFollowUp: '', note: '' };

function toDateInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

/**
 * Create/edit lead dialog. `lead` null -> create; otherwise edit.
 * All five fields the backend requires (companyName/contactName/email/phone/source)
 * are enforced client-side. On create, an optional initial note is routed through
 * the existing addNote endpoint so it appears in the timeline.
 */
export default function LeadFormDialog({ open, onOpenChange, lead, onSaved }) {
  const isEdit = Boolean(lead);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setError('');
    if (lead) {
      setForm({
        companyName: lead.companyName || lead.company || '',
        contactName: lead.contactName || lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        source: lead.source || 'web',
        nextFollowUp: toDateInput(lead.nextFollowUp),
        note: '',
      });
    } else {
      setForm(EMPTY);
    }
  }, [open, lead]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const required = ['companyName', 'contactName', 'email', 'phone', 'source'];
    if (required.some((f) => !String(form[f]).trim())) {
      setError('Empresa, contacto, email, teléfono y fuente son requeridos');
      return;
    }
    setSubmitting(true);
    setError('');
    const payload = {
      companyName: form.companyName.trim(),
      contactName: form.contactName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      source: form.source,
      nextFollowUp: form.nextFollowUp ? new Date(form.nextFollowUp).toISOString() : null,
    };
    try {
      if (isEdit) {
        await api.update(lead.id, payload);
        toast.success('Lead actualizado');
      } else {
        const res = await api.create(payload);
        const created = res.data;
        if (form.note.trim() && created?.id) {
          try { await api.addNote(created.id, form.note.trim()); } catch { /* note is best-effort */ }
        }
        toast.success('Lead creado');
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      const message = err.message || 'Error al guardar el lead';
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
          <DialogTitle>{isEdit ? 'Editar lead' : 'Nuevo lead'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Actualiza los datos del lead.' : 'Registra un nuevo lead en el pipeline.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="lead-company">Empresa</Label>
            <Input id="lead-company" value={form.companyName} onChange={(e) => set('companyName', e.target.value)} placeholder="Nombre de la empresa" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="lead-contact">Contacto</Label>
              <Input id="lead-contact" value={form.contactName} onChange={(e) => set('contactName', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lead-phone">Teléfono</Label>
              <Input id="lead-phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lead-email">Email</Label>
            <Input id="lead-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="lead-source">Fuente</Label>
              <Select value={form.source} onValueChange={(v) => set('source', v)}>
                <SelectTrigger id="lead-source">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_SOURCES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lead-followup">Próximo seguimiento</Label>
              <Input id="lead-followup" type="date" value={form.nextFollowUp} onChange={(e) => set('nextFollowUp', e.target.value)} />
            </div>
          </div>

          {!isEdit && (
            <div className="space-y-1.5">
              <Label htmlFor="lead-note">Nota inicial</Label>
              <Textarea id="lead-note" rows={2} value={form.note} onChange={(e) => set('note', e.target.value)} placeholder="Opcional" />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
