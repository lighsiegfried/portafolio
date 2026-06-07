import { useState, useEffect, useCallback } from 'react';
import * as api from '../../services/leadsApi';
import { useAuth } from '../hooks/useAuth';
import { userCan } from '../utils/permissions';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { formatDate } from '../utils/formatters';

export default function LeadsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [actErr, setActErr] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.list({ limit: '50' });
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const columns = [
    { key: 'company', label: 'Empresa', render: (r) => r.company || r.companyName || '-' },
    { key: 'name', label: 'Contacto', render: (r) => r.name || r.contactName || '-' },
    { key: 'email', label: 'Email', render: (r) => <span className="text-xs text-secondary">{r.email || '-'}</span> },
    { key: 'phone', label: 'Telefono', render: (r) => <span className="text-xs text-secondary">{r.phone || '-'}</span> },
    { key: 'status', label: 'Estado', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'estimatedValue', label: 'Valor est.', render: (r) => {
      const v = r.estimatedValue;
      return <span className="text-xs">{v != null ? '$' + Number(v).toLocaleString('es-MX') : '-'}</span>;
    }},
    { key: 'nextFollowUp', label: 'Prox. Seguimiento', render: (r) => <span className="text-xs text-secondary">{r.nextFollowUp ? formatDate(r.nextFollowUp) : '-'}</span> },
    {
      key: 'actions', label: '', className: 'text-right',
      render: (r) => userCan(user, 'manageLeads') ? (
        <div className="flex justify-end gap-1">
          <button onClick={() => setShowDetail(r)} className="text-xs px-2 py-1 rounded border border-white/10 text-secondary hover:text-white hover:border-white/20 transition-colors">Ver</button>
        </div>
      ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">CRM Lite</h1>
          <p className="text-sm text-secondary mt-1">Gestion de leads y clientes potenciales</p>
        </div>
        {userCan(user, 'manageLeads') && (
          <button onClick={() => setShowCreate(true)} className="px-4 py-2 text-sm rounded-lg bg-violet-500/80 hover:bg-violet-500 text-white transition-colors">+ Nuevo Lead</button>
        )}
      </div>

      {actErr && <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{actErr}</div>}

      <div className="bg-tertiary/30 border border-white/10 rounded-xl overflow-hidden">
        <DataTable columns={columns} data={data} loading={loading} error={error} onRetry={load} emptyMessage="Sin leads" />
      </div>

      {showDetail && (
        <LeadDetailModal lead={showDetail} onClose={() => setShowDetail(null)} onUpdated={() => { setShowDetail(null); load(); }} user={user} />
      )}

      {showCreate && (
        <CreateLeadModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); load(); }} />
      )}
    </div>
  );
}

const STATUS_OPTIONS = ['new', 'in_contact', 'negotiation', 'won', 'lost'];

function LeadDetailModal({ lead, onClose, onUpdated, user }) {
  const [status, setStatus] = useState(lead.status);
  const [noteContent, setNoteContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function handleUpdateStatus() {
    setErr('');
    try {
      await api.update(lead.id, { status });
      onUpdated();
    } catch (err) {
      setErr(err.message);
    }
  }

  async function handleAddNote() {
    if (!noteContent.trim()) return;
    setSaving(true); setErr('');
    try {
      await api.addNote(lead.id, noteContent.trim());
      setNoteContent('');
      onUpdated();
    } catch (err) {
      setErr(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-tertiary border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">{lead.company || lead.companyName || 'Lead'}</h3>
          <button onClick={onClose} className="text-secondary hover:text-white text-lg">&times;</button>
        </div>
        {err && <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">{err}</div>}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-secondary">Contacto</span><span className="text-white">{lead.name || lead.contactName || '-'}</span></div>
          <div className="flex justify-between"><span className="text-secondary">Email</span><span className="text-white">{lead.email || '-'}</span></div>
          <div className="flex justify-between"><span className="text-secondary">Telefono</span><span className="text-white">{lead.phone || '-'}</span></div>
          <div className="flex justify-between"><span className="text-secondary">Fuente</span><span className="text-white">{lead.source || '-'}</span></div>
          {lead.notes && <div><span className="text-secondary">Notas</span><p className="text-white mt-1 text-xs">{lead.notes}</p></div>}
        </div>

        {userCan(user, 'manageLeads') && (
          <div className="mt-4 p-3 bg-primary/30 rounded-lg border border-white/10 space-y-3">
            <div className="flex items-center gap-2">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="flex-1 bg-primary/50 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={handleUpdateStatus} className="px-3 py-1.5 text-xs rounded-lg bg-violet-500/80 hover:bg-violet-500 text-white">Actualizar</button>
            </div>
            <div className="flex gap-2">
              <input type="text" value={noteContent} onChange={(e) => setNoteContent(e.target.value)} placeholder="Agregar nota..." className="flex-1 bg-primary/50 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs" />
              <button onClick={handleAddNote} disabled={saving || !noteContent.trim()} className="px-3 py-1.5 text-xs rounded-lg bg-violet-500/80 hover:bg-violet-500 text-white disabled:opacity-50">Agregar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CreateLeadModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ companyName: '', contactName: '', email: '', phone: '', source: 'web', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  function set(field, val) { setForm((f) => ({ ...f, [field]: val })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.companyName.trim()) { setErr('El nombre de la empresa es requerido'); return; }
    setSubmitting(true); setErr('');
    try {
      await api.create(form);
      onCreated();
    } catch (err) {
      setErr(err.message || 'Error al crear');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-tertiary border border-white/10 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Nuevo Lead</h3>
          <button onClick={onClose} className="text-secondary hover:text-white text-lg">&times;</button>
        </div>
        {err && <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">{err}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-secondary mb-1">Empresa *</label>
            <input type="text" value={form.companyName} onChange={(e) => set('companyName', e.target.value)} className="w-full bg-primary/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-secondary mb-1">Contacto</label>
              <input type="text" value={form.contactName} onChange={(e) => set('contactName', e.target.value)} className="w-full bg-primary/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-secondary mb-1">Telefono</label>
              <input type="text" value={form.phone} onChange={(e) => set('phone', e.target.value)} className="w-full bg-primary/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="w-full bg-primary/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-secondary mb-1">Fuente</label>
              <select value={form.source} onChange={(e) => set('source', e.target.value)} className="w-full bg-primary/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                <option value="web">Web</option><option value="referencia">Referencia</option><option value="llamada">Llamada</option><option value="otro">Otro</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1">Notas</label>
            <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={2} className="w-full bg-primary/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
          </div>
          <button type="submit" disabled={submitting} className="w-full py-2.5 rounded-lg bg-violet-500/80 hover:bg-violet-500 text-white text-sm font-medium transition-colors disabled:opacity-50">
            {submitting ? 'Creando...' : 'Crear Lead'}
          </button>
        </form>
      </div>
    </div>
  );
}
