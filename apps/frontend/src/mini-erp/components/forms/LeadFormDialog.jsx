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
import useErpTranslation from '../../i18n/useErpTranslation';

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
  const { te } = useErpTranslation();
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
      setError(te.leads.form.errors.required);
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
        toast.success(te.toast.leadUpdated);
      } else {
        const res = await api.create(payload);
        const created = res.data;
        if (form.note.trim() && created?.id) {
          try { await api.addNote(created.id, form.note.trim()); } catch { /* note is best-effort */ }
        }
        toast.success(te.toast.leadCreated);
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      const message = err.message || te.errors.saveLead;
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
          <DialogTitle>{isEdit ? te.leads.form.editTitle : te.leads.form.createTitle}</DialogTitle>
          <DialogDescription>
            {isEdit ? te.leads.form.editDescription : te.leads.form.createDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-red-600 dark:text-red-300">
              {error}
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="lead-company">{te.leads.form.company}</Label>
            <Input id="lead-company" value={form.companyName} onChange={(e) => set('companyName', e.target.value)} placeholder={te.leads.form.companyPlaceholder} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="lead-contact">{te.leads.form.contact}</Label>
              <Input id="lead-contact" value={form.contactName} onChange={(e) => set('contactName', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lead-phone">{te.leads.form.phone}</Label>
              <Input id="lead-phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lead-email">{te.leads.form.email}</Label>
            <Input id="lead-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="lead-source">{te.leads.form.source}</Label>
              <Select value={form.source} onValueChange={(v) => set('source', v)}>
                <SelectTrigger id="lead-source">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_SOURCES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{te.leads.sources[s.value] || s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lead-followup">{te.leads.form.nextFollowUp}</Label>
              <Input id="lead-followup" type="date" value={form.nextFollowUp} onChange={(e) => set('nextFollowUp', e.target.value)} />
            </div>
          </div>

          {!isEdit && (
            <div className="space-y-1.5">
              <Label htmlFor="lead-note">{te.leads.form.note}</Label>
              <Textarea id="lead-note" rows={2} value={form.note} onChange={(e) => set('note', e.target.value)} placeholder={te.leads.form.notePlaceholder} />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {te.common.cancel}
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting
                ? te.leads.form.submitting
                : isEdit
                  ? te.leads.form.submitEdit
                  : te.leads.form.submitCreate}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
