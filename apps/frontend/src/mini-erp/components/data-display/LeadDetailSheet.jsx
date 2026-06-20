import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/mini-erp/components/ui/sheet';
import { Button } from '@/mini-erp/components/ui/button';
import { Input } from '@/mini-erp/components/ui/input';
import { Separator } from '@/mini-erp/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/mini-erp/components/ui/select';
import StatusBadge from '../StatusBadge';
import * as api from '../../../services/leadsApi';
import { LEAD_STAGES, leadCompany, leadContact, sourceLabel } from '../../config/leads';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';

function normalizeNotes(notes) {
  if (!notes) return [];
  const list = Array.isArray(notes) ? notes : [notes];
  return list
    .map((n, i) => {
      if (!n) return null;
      if (typeof n === 'string') return n.trim() ? { id: `n-${i}`, content: n.trim() } : null;
      const content = n.content || n.note || n.text || '';
      return content ? { id: n.id || `n-${i}`, content, createdAt: n.createdAt } : null;
    })
    .filter(Boolean);
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right text-foreground">{children}</span>
    </div>
  );
}

/**
 * Lead detail sheet: summary, quick status update, notes timeline, add note.
 * Mutating actions are gated by `canManage`.
 */
export default function LeadDetailSheet({ open, onOpenChange, lead, canManage, onEdit, onChanged }) {
  const [status, setStatus] = useState('new');
  const [savingStatus, setSavingStatus] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    if (lead) setStatus(lead.status);
    setNoteContent('');
  }, [lead]);

  if (!lead) return null;

  const notes = normalizeNotes(lead.notes);

  async function handleStatusUpdate() {
    if (status === lead.status) return;
    setSavingStatus(true);
    try {
      await api.update(lead.id, { status });
      toast.success('Estado actualizado');
      onChanged();
    } catch (err) {
      toast.error(err.message || 'Error al actualizar estado');
      setStatus(lead.status);
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleAddNote() {
    if (!noteContent.trim()) return;
    setSavingNote(true);
    try {
      await api.addNote(lead.id, noteContent.trim());
      setNoteContent('');
      toast.success('Nota agregada');
      onChanged();
    } catch (err) {
      toast.error(err.message || 'Error al agregar nota');
    } finally {
      setSavingNote(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <SheetTitle className="truncate">{leadCompany(lead)}</SheetTitle>
            {canManage && (
              <Button variant="outline" size="sm" onClick={() => onEdit(lead)}>
                <Pencil className="size-4" />
                Editar
              </Button>
            )}
          </div>
          <SheetDescription className="flex items-center gap-2">
            <StatusBadge status={lead.status} />
            <span className="text-xs">{sourceLabel(lead.source)}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4">
          <Row label="Contacto">{leadContact(lead)}</Row>
          <Row label="Email">{lead.email || '-'}</Row>
          <Row label="Teléfono">{lead.phone || '-'}</Row>
          <Row label="Valor estimado">{lead.estimatedValue != null ? formatCurrency(lead.estimatedValue) : '-'}</Row>
          <Row label="Próximo seguimiento">{lead.nextFollowUp ? formatDate(lead.nextFollowUp) : '-'}</Row>
        </div>

        {canManage && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Cambiar estado</p>
              <div className="flex items-center gap-2">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_STAGES.map((s) => (
                      <SelectItem key={s.status} value={s.status}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleStatusUpdate} disabled={savingStatus || status === lead.status}>
                  Actualizar
                </Button>
              </div>
            </div>
          </>
        )}

        <Separator className="my-4" />
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Notas ({notes.length})
          </p>

          {canManage && (
            <div className="flex items-center gap-2">
              <Input
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Agregar nota..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNote();
                  }
                }}
              />
              <Button onClick={handleAddNote} disabled={savingNote || !noteContent.trim()}>
                Agregar
              </Button>
            </div>
          )}

          {notes.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground">Sin notas todavía</p>
          ) : (
            <ul className="space-y-2">
              {notes.map((n) => (
                <li key={n.id} className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                  <p className="text-sm leading-relaxed text-foreground">{n.content}</p>
                  {n.createdAt && (
                    <p className="mt-1 text-[10px] text-muted-foreground">{formatDateTime(n.createdAt)}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
