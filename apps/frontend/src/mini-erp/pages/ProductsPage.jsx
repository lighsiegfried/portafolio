import { useState, useEffect, useCallback } from 'react';
import * as api from '../../services/productsApi';
import { useAuth } from '../hooks/useAuth';
import { userCan } from '../utils/permissions';
import DataTable from '../components/DataTable';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function ProductsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
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

  async function handleStockUpdate(product) {
    const type = prompt('Tipo (IN / OUT):')?.toUpperCase();
    if (!type || (type !== 'IN' && type !== 'OUT')) return;
    const qty = parseInt(prompt('Cantidad:'), 10);
    if (!qty || qty <= 0) return;
    setActErr('');
    try {
      await api.updateStock(product.id, { type, quantity: qty, reference: 'Ajuste desde frontend' });
      await load();
    } catch (err) {
      setActErr(err.message);
    }
  }

  const columns = [
    { key: 'sku', label: 'SKU', render: (r) => <span className="text-xs font-mono text-violet-300">{r.sku}</span> },
    { key: 'name', label: 'Nombre' },
    { key: 'category', label: 'Categoria', render: (r) => <span className="text-xs text-secondary">{r.category}</span> },
    { key: 'stock', label: 'Stock', render: (r) => {
      const low = r.stock <= (r.minStock || 0);
      return <span className={`text-sm font-medium ${low ? 'text-red-300' : 'text-white'}`}>{formatNumber(r.stock)}</span>;
    }},
    { key: 'minStock', label: 'Stock Min', render: (r) => <span className="text-secondary text-xs">{formatNumber(r.minStock)}</span> },
    { key: 'unit', label: 'Unidad', render: (r) => <span className="text-secondary text-xs">{r.unit}</span> },
    { key: 'price', label: 'Precio', render: (r) => <span className="text-white text-xs">{formatCurrency(r.price)}</span> },
    {
      key: 'actions', label: '', className: 'text-right',
      render: (r) => userCan(user, 'updateStock') ? (
        <button onClick={() => handleStockUpdate(r)} className="text-xs px-2 py-1 rounded border border-white/10 text-secondary hover:text-white hover:border-white/20 transition-colors">Stock</button>
      ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Productos</h1>
          <p className="text-sm text-secondary mt-1">Catalogo de productos y materiales</p>
        </div>
        {userCan(user, 'createProduct') && (
          <button onClick={() => setShowCreate(true)} className="px-4 py-2 text-sm rounded-lg bg-violet-500/80 hover:bg-violet-500 text-white transition-colors">+ Nuevo</button>
        )}
      </div>

      {actErr && <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{actErr}</div>}

      <div className="bg-tertiary/30 border border-white/10 rounded-xl overflow-hidden">
        <DataTable columns={columns} data={data} loading={loading} error={error} onRetry={load} emptyMessage="Sin productos" />
      </div>

      {showCreate && (
        <CreateModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); load(); }} />
      )}
    </div>
  );
}

function CreateModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ sku: '', name: '', category: 'insumo', unit: 'unidad', price: 0, minStock: 0, initialStock: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  function set(field, val) { setForm((f) => ({ ...f, [field]: val })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.sku.trim() || !form.name.trim()) { setErr('SKU y nombre requeridos'); return; }
    setSubmitting(true); setErr('');
    try {
      await api.create({ ...form });
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
          <h3 className="text-white font-semibold">Nuevo Producto</h3>
          <button onClick={onClose} className="text-secondary hover:text-white text-lg">&times;</button>
        </div>
        {err && <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">{err}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-secondary mb-1">SKU</label>
              <input type="text" value={form.sku} onChange={(e) => set('sku', e.target.value)} className="w-full bg-primary/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50" />
            </div>
            <div>
              <label className="block text-xs text-secondary mb-1">Unidad</label>
              <input type="text" value={form.unit} onChange={(e) => set('unit', e.target.value)} className="w-full bg-primary/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1">Nombre</label>
            <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} className="w-full bg-primary/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-secondary mb-1">Categoria</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className="w-full bg-primary/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50">
                <option value="insumo">Insumo</option><option value="materia_prima">Materia Prima</option><option value="equipo">Equipo</option><option value="servicio">Servicio</option><option value="oficina">Oficina</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-secondary mb-1">Precio</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => set('price', parseFloat(e.target.value) || 0)} className="w-full bg-primary/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-secondary mb-1">Stock Inicial</label>
              <input type="number" value={form.initialStock} onChange={(e) => set('initialStock', parseInt(e.target.value) || 0)} className="w-full bg-primary/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50" />
            </div>
            <div>
              <label className="block text-xs text-secondary mb-1">Stock Minimo</label>
              <input type="number" value={form.minStock} onChange={(e) => set('minStock', parseInt(e.target.value) || 0)} className="w-full bg-primary/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50" />
            </div>
          </div>
          <button type="submit" disabled={submitting} className="w-full py-2.5 rounded-lg bg-violet-500/80 hover:bg-violet-500 text-white text-sm font-medium transition-colors disabled:opacity-50">
            {submitting ? 'Creando...' : 'Crear Producto'}
          </button>
        </form>
      </div>
    </div>
  );
}
