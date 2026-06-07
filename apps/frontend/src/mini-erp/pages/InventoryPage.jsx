import { useState, useEffect, useCallback } from 'react';
import * as invApi from '../../services/inventoryApi';
import * as prodApi from '../../services/productsApi';
import { useAuth } from '../hooks/useAuth';
import { userCan } from '../utils/permissions';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { formatDate, formatNumber } from '../utils/formatters';

export default function InventoryPage() {
  const { user } = useAuth();
  const [movements, setMovements] = useState(null);
  const [lowStock, setLowStock] = useState(null);
  const [loadingMov, setLoadingMov] = useState(true);
  const [loadingLow, setLoadingLow] = useState(true);
  const [errorMov, setErrorMov] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [actErr, setActErr] = useState('');

  const load = useCallback(async () => {
    setLoadingMov(true); setErrorMov(null);
    try {
      const [movRes, lowRes] = await Promise.all([invApi.listMovements({ limit: '20' }), invApi.lowStock()]);
      setMovements(movRes.data);
      setLowStock(lowRes.data);
    } catch (err) {
      setErrorMov(err.message);
    } finally {
      setLoadingMov(false); setLoadingLow(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const movColumns = [
    { key: 'type', label: 'Tipo', render: (r) => <span className={`text-xs font-bold ${r.type === 'IN' ? 'text-green-400' : 'text-red-400'}`}>{r.type}</span> },
    { key: 'quantity', label: 'Cantidad', render: (r) => formatNumber(r.quantity) },
    { key: 'stockBefore', label: 'Stock Antes', render: (r) => formatNumber(r.stockBefore) },
    { key: 'stockAfter', label: 'Stock Despues', render: (r) => formatNumber(r.stockAfter) },
    { key: 'reason', label: 'Motivo' },
    { key: 'createdAt', label: 'Fecha', render: (r) => <span className="text-secondary text-xs">{formatDate(r.createdAt)}</span> },
  ];

  const lowColumns = [
    { key: 'sku', label: 'SKU', render: (r) => <span className="text-xs font-mono text-violet-300">{r.sku}</span> },
    { key: 'name', label: 'Nombre' },
    { key: 'stock', label: 'Stock', render: (r) => <span className="text-red-300 font-medium">{formatNumber(r.stock)}</span> },
    { key: 'minStock', label: 'Stock Min', render: (r) => <span className="text-secondary text-xs">{formatNumber(r.minStock)}</span> },
    { key: 'status', label: 'Estado', render: () => <StatusBadge status="rejected" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Inventario</h1>
          <p className="text-sm text-secondary mt-1">Movimientos y control de stock</p>
        </div>
        {userCan(user, 'createMovement') && (
          <button onClick={() => setShowCreate(true)} className="px-4 py-2 text-sm rounded-lg bg-violet-500/80 hover:bg-violet-500 text-white transition-colors">+ Registrar Movimiento</button>
        )}
      </div>

      {actErr && <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{actErr}</div>}

      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Productos con Bajo Stock</h2>
        <div className="bg-tertiary/30 border border-red-500/20 rounded-xl overflow-hidden">
          <DataTable columns={lowColumns} data={lowStock} loading={loadingLow} emptyMessage="Sin productos con bajo stock" />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Movimientos Recientes</h2>
        <div className="bg-tertiary/30 border border-white/10 rounded-xl overflow-hidden">
          <DataTable columns={movColumns} data={movements} loading={loadingMov} error={errorMov} onRetry={load} emptyMessage="Sin movimientos" />
        </div>
      </div>

      {showCreate && (
        <CreateMovementModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); load(); }} setError={setActErr} />
      )}
    </div>
  );
}

function CreateMovementModal({ onClose, onCreated, setError }) {
  const [form, setForm] = useState({ productId: '', type: 'IN', quantity: 1, reference: '', notes: '' });
  const [products, setProducts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    prodApi.list({ limit: '50' }).then((res) => setProducts(res.data || [])).catch(() => {});
  }, []);

  function set(field, val) { setForm((f) => ({ ...f, [field]: val })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.productId || !form.quantity || form.quantity <= 0) { setErr('Seleccione producto y cantidad valida'); return; }
    setSubmitting(true); setErr('');
    try {
      await invApi.createMovement(form);
      onCreated();
    } catch (err) {
      setErr(err.message || 'Error al registrar movimiento');
      setError(err.message || 'Error al registrar movimiento');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-tertiary border border-white/10 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Registrar Movimiento</h3>
          <button onClick={onClose} className="text-secondary hover:text-white text-lg">&times;</button>
        </div>
        {err && <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">{err}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-secondary mb-1">Producto</label>
            <select value={form.productId} onChange={(e) => set('productId', e.target.value)} className="w-full bg-primary/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50">
              <option value="">Seleccionar...</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.sku} - {p.name} (stock: {p.stock})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-secondary mb-1">Tipo</label>
              <select value={form.type} onChange={(e) => set('type', e.target.value)} className="w-full bg-primary/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50">
                <option value="IN">Entrada (IN)</option><option value="OUT">Salida (OUT)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-secondary mb-1">Cantidad</label>
              <input type="number" value={form.quantity} onChange={(e) => set('quantity', parseInt(e.target.value) || 1)} min="1" className="w-full bg-primary/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1">Referencia</label>
            <input type="text" value={form.reference} onChange={(e) => set('reference', e.target.value)} className="w-full bg-primary/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50" placeholder="Ej: Compra proveedor" />
          </div>
          <button type="submit" disabled={submitting} className="w-full py-2.5 rounded-lg bg-violet-500/80 hover:bg-violet-500 text-white text-sm font-medium transition-colors disabled:opacity-50">
            {submitting ? 'Registrando...' : 'Registrar Movimiento'}
          </button>
        </form>
      </div>
    </div>
  );
}
