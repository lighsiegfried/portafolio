import { useState, useEffect } from 'react';
import { getSummary } from '../../services/dashboardApi';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency, formatDate, formatNumber, statusLabel } from '../utils/formatters';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true); setError(null);
    try {
      const res = await getSummary();
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-red-300 text-sm mb-4">{error}</p>
        <button onClick={load} className="px-4 py-2 text-xs rounded-lg border border-violet-500/30 text-violet-300 hover:bg-violet-500/10">Reintentar</button>
      </div>
    );
  }

  if (!data) return null;

  const reqColumns = [
    { key: 'number', label: 'Numero', render: (r) => <span className="text-xs font-mono text-violet-300">{r.number}</span> },
    { key: 'title', label: 'Titulo' },
    { key: 'status', label: 'Estado', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'createdAt', label: 'Fecha', render: (r) => <span className="text-secondary text-xs">{formatDate(r.createdAt)}</span> },
  ];

  const movColumns = [
    { key: 'type', label: 'Tipo', render: (r) => <span className={`text-xs font-medium ${r.type === 'IN' ? 'text-green-400' : 'text-red-400'}`}>{r.type}</span> },
    { key: 'quantity', label: 'Cantidad', render: (r) => formatNumber(r.quantity) },
    { key: 'reason', label: 'Motivo' },
    { key: 'createdAt', label: 'Fecha', render: (r) => <span className="text-secondary text-xs">{formatDate(r.createdAt)}</span> },
  ];

  const leadColumns = [
    { key: 'company', label: 'Empresa', render: (l) => l.company || l.companyName },
    { key: 'status', label: 'Estado', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'assignedTo', label: 'Asignado', render: (r) => {
      const user = data.users?.find((u) => u.id === r.assignedTo);
      return <span className="text-secondary text-xs">{user?.username || r.assignedTo || '-'}</span>;
    }},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-secondary mt-1">Resumen del sistema</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard label="Reqs Pendientes" value={data.pendingRequisitions} accent="yellow" />
        <StatCard label="Reqs Aprobadas" value={data.approvedRequisitions} accent="blue" />
        <StatCard label="Reqs Completadas" value={data.completedRequisitions} accent="green" />
        <StatCard label="Reqs Rechazadas" value={data.rejectedRequisitions} accent="red" />
        <StatCard label="Bajo Stock" value={data.lowStockProducts} accent="red" />
        <StatCard label="Leads Activos" value={data.activeLeads} accent="cyan" />
        <StatCard label="Total Productos" value={formatNumber(data.totalProducts)} accent="violet" />
        <StatCard
          label="Valor Inventario"
          value={formatCurrency(data.totalInventoryValue)}
          accent="green"
        />
      </div>

      {data.recentRequisitions && data.recentRequisitions.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-white mb-3">Requisiciones Recientes</h2>
          <div className="bg-tertiary/30 border border-white/10 rounded-xl overflow-hidden">
            <DataTable columns={reqColumns} data={data.recentRequisitions.slice(0, 5)} />
          </div>
        </div>
      )}

      {data.recentMovements && data.recentMovements.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-white mb-3">Movimientos Recientes</h2>
          <div className="bg-tertiary/30 border border-white/10 rounded-xl overflow-hidden">
            <DataTable columns={movColumns} data={data.recentMovements.slice(0, 5)} />
          </div>
        </div>
      )}

      {data.recentLeads && data.recentLeads.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-white mb-3">Leads Recientes</h2>
          <div className="bg-tertiary/30 border border-white/10 rounded-xl overflow-hidden">
            <DataTable columns={leadColumns} data={data.recentLeads.slice(0, 5)} />
          </div>
        </div>
      )}
    </div>
  );
}
