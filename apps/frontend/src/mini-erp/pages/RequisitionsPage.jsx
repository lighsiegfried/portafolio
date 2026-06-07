import { useState, useEffect, useCallback } from 'react';
import * as api from '../../services/requisitionsApi';
import { useAuth } from '../hooks/useAuth';
import { userCan } from '../utils/permissions';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { formatDate, formatCurrency } from '../utils/formatters';

export default function RequisitionsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [actionError, setActionError] = useState('');

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

  async function handleAction(id, action, extra) {
    setActionError('');
    try {
      if (action === 'approve') await api.approve(id);
      else if (action === 'reject') await api.reject(id, extra);
      else if (action === 'complete') await api.complete(id);
      await load();
    } catch (err) {
      setActionError(err.message || 'Error al ejecutar accion');
    }
  }

  const columns = [
    { key: 'number', label: 'Numero', render: (r) => <span className="text-xs font-mono text-violet-300">{r.number}</span> },
    { key: 'title', label: 'Titulo' },
    { key: 'status', label: 'Estado', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'createdBy', label: 'Creado por', render: (r) => <span className="text-secondary text-xs">{(r.createdBy || '').slice(0, 8)}</span> },
    { key: 'priority', label: 'Prioridad', render: (r) => <span className={`text-xs font-medium ${r.priority === 'urgente' ? 'text-red-300' : r.priority === 'alta' ? 'text-yellow-300' : 'text-secondary'}`}>{r.priority || '-'}</span> },
    { key: 'createdAt', label: 'Fecha', render: (r) => <span className="text-secondary text-xs">{formatDate(r.createdAt)}</span> },
    {
      key: 'actions', label: 'Acciones', className: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-1.5 flex-wrap">
          <button onClick={() => setShowDetail(r)} className="text-xs px-2 py-1 rounded border border-white/10 text-secondary hover:text-white hover:border-white/20 transition-colors">Ver</button>
          {r.status === 'pending' && userCan(user, 'approveRequisition') && (
            <button onClick={() => handleAction(r.id, 'approve')} className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/20 transition-colors">Aprobar</button>
          )}
          {r.status === 'pending' && userCan(user, 'rejectRequisition') && (
            <button onClick={() => handleReject(r)} className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/20 transition-colors">Rechazar</button>
          )}
          {r.status === 'approved' && userCan(user, 'completeRequisition') && (
            <button onClick={() => handleAction(r.id, 'complete')} className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/20 transition-colors">Completar</button>
          )}
        </div>
      ),
    },
  ];

  function handleReject(item) {
    const reason = prompt('Motivo de rechazo:');
    if (reason) handleAction(item.id, 'reject', reason);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Requisiciones</h1>
          <p className="text-sm text-secondary mt-1">Solicitudes de compra</p>
        </div>
        {userCan(user, 'createRequisition') && (
          <button onClick={() => setShowCreate(true)} className="px-4 py-2 text-sm rounded-lg bg-violet-500/80 hover:bg-violet-500 text-white transition-colors">+ Nueva</button>
        )}
      </div>

      {actionError && (
        <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{actionError}</div>
      )}

      <div className="bg-tertiary/30 border border-white/10 rounded-xl overflow-hidden">
        <DataTable columns={columns} data={data} loading={loading} error={error} onRetry={load} emptyMessage="Sin requisiciones" />
      </div>

      {showDetail && (
        <DetailModal item={showDetail} onClose={() => { setShowDetail(null); setActionError(''); }} onAction={handleAction} user={user} />
      )}

      {showCreate && (
        <CreateModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); load(); }} />
      )}
    </div>
  );
}

function DetailModal({ item, onClose, onAction, user }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-tertiary border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">{item.title}</h3>
          <button onClick={onClose} className="text-secondary hover:text-white text-lg">&times;</button>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-secondary">Numero</span><span className="text-white font-mono text-xs">{item.number}</span></div>
          <div className="flex justify-between"><span className="text-secondary">Estado</span><StatusBadge status={item.status} /></div>
          <div className="flex justify-between"><span className="text-secondary">Prioridad</span><span className="text-white">{item.priority || '-'}</span></div>
          <div className="flex justify-between"><span className="text-secondary">Costo estimado</span><span className="text-white">{item.totalEstimatedCost ? formatCurrency(item.totalEstimatedCost) : '-'}</span></div>
          {item.notes && <div><span className="text-secondary">Notas</span><p className="text-white mt-1">{item.notes}</p></div>}
          {item.rejectionReason && <div><span className="text-secondary">Motivo de rechazo</span><p className="text-red-300 mt-1">{item.rejectionReason}</p></div>}
          <div className="flex justify-between"><span className="text-secondary">Creado</span><span className="text-white text-xs">{formatDate(item.createdAt)}</span></div>
        </div>
        <div className="mt-6 flex gap-2">
          {item.status === 'pending' && userCan(user, 'approveRequisition') && (
            <button onClick={() => { onAction(item.id, 'approve'); onClose(); }} className="flex-1 py-2 text-sm rounded-lg bg-blue-500/80 hover:bg-blue-500 text-white">Aprobar</button>
          )}
          {item.status === 'pending' && userCan(user, 'rejectRequisition') && (
            <button onClick={() => { onAction(item.id, 'reject', prompt('Motivo:')); onClose(); }} className="flex-1 py-2 text-sm rounded-lg bg-red-500/80 hover:bg-red-500 text-white">Rechazar</button>
          )}
          {item.status === 'approved' && userCan(user, 'completeRequisition') && (
            <button onClick={() => { onAction(item.id, 'complete'); onClose(); }} className="flex-1 py-2 text-sm rounded-lg bg-green-500/80 hover:bg-green-500 text-white">Completar</button>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateModal({ onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([{ productName: '', quantity: 1, unit: 'unidad', estimatedCost: 0 }]);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) { setErr('El titulo es requerido'); return; }
    const validItems = items.filter((i) => i.productName.trim());
    if (validItems.length === 0) { setErr('Agregue al menos un item'); return; }
    setSubmitting(true); setErr('');
    try {
      await api.create({ title: title.trim(), description: description.trim(), items: validItems });
      onCreated();
    } catch (err) {
      setErr(err.message || 'Error al crear');
    } finally {
      setSubmitting(false);
    }
  }

  function addItem() {
    setItems([...items, { productName: '', quantity: 1, unit: 'unidad', estimatedCost: 0 }]);
  }

  function updateItem(i, field, val) {
    const copy = [...items];
    copy[i] = { ...copy[i], [field]: val };
    setItems(copy);
  }

  function removeItem(i) {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== i));
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-tertiary border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Nueva Requisicion</h3>
          <button onClick={onClose} className="text-secondary hover:text-white text-lg">&times;</button>
        </div>
        {err && <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">{err}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-secondary mb-1">Titulo</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-primary/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50" placeholder="Ej: Compra de insumos" />
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1">Descripcion</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full bg-primary/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50" />
          </div>
          <div>
            <label className="block text-xs text-secondary mb-2">Items</label>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <input type="text" value={item.productName} onChange={(e) => updateItem(i, 'productName', e.target.value)} placeholder="Producto" className="flex-1 bg-primary/50 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-violet-500/50" />
                  <input type="number" value={item.quantity} onChange={(e) => updateItem(i, 'quantity', parseInt(e.target.value) || 1)} className="w-16 bg-primary/50 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-violet-500/50" />
                  <input type="number" value={item.estimatedCost} onChange={(e) => updateItem(i, 'estimatedCost', parseFloat(e.target.value) || 0)} className="w-20 bg-primary/50 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-violet-500/50" />
                  <button type="button" onClick={() => removeItem(i)} className="text-red-300 hover:text-red-200 px-1">&times;</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addItem} className="mt-2 text-xs text-violet-300 hover:text-violet-200">+ Agregar item</button>
          </div>
          <button type="submit" disabled={submitting} className="w-full py-2.5 rounded-lg bg-violet-500/80 hover:bg-violet-500 text-white text-sm font-medium transition-colors disabled:opacity-50">
            {submitting ? 'Creando...' : 'Crear Requisicion'}
          </button>
        </form>
      </div>
    </div>
  );
}
