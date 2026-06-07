import { useAuth } from '../hooks/useAuth';
import { userCan } from '../utils/permissions';
import { downloadRequisitions, downloadInventory, downloadLeads } from '../../services/reportsApi';

const REPORTS = [
  {
    key: 'requisitions', title: 'Requisiciones', desc: 'Exportar todas las requisiciones a CSV',
    action: 'downloadRequisitionsCsv', downloadFn: downloadRequisitions,
    filename: 'requisiciones.csv',
  },
  {
    key: 'inventory', title: 'Inventario', desc: 'Exportar catalogo de productos a CSV',
    action: 'downloadInventoryCsv', downloadFn: downloadInventory,
    filename: 'inventario.csv',
  },
  {
    key: 'leads', title: 'Leads', desc: 'Exportar leads y clientes potenciales a CSV',
    action: 'downloadLeadsCsv', downloadFn: downloadLeads,
    filename: 'leads.csv',
  },
];

export default function ReportsPage() {
  const { user } = useAuth();

  async function handleDownload(report) {
    try {
      const blob = await report.downloadFn();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = report.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error al descargar: ' + (err.message || 'Desconocido'));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Reportes</h1>
        <p className="text-sm text-secondary mt-1">Exportacion de datos a CSV</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTS.map((report) => {
          const permitted = userCan(user, report.action);
          return (
            <div
              key={report.key}
              className={`bg-tertiary/50 backdrop-blur-sm border rounded-xl p-5 ${
                permitted ? 'border-white/10' : 'border-white/5 opacity-50'
              }`}
            >
              <h3 className="text-white font-semibold text-sm mb-1">{report.title}</h3>
              <p className="text-xs text-secondary mb-4">{report.desc}</p>
              {permitted ? (
                <button
                  onClick={() => handleDownload(report)}
                  className="w-full py-2 text-sm rounded-lg bg-violet-500/80 hover:bg-violet-500 text-white transition-colors"
                >
                  Descargar CSV
                </button>
              ) : (
                <p className="text-xs text-red-300/60">No tienes permisos para descargar este reporte.</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-xs text-secondary bg-tertiary/30 border border-white/10 rounded-xl p-4">
        Los reportes se generan con los datos actuales en memoria. Los archivos CSV pueden abrirse en Excel, Google Sheets o cualquier editor de texto.
      </div>
    </div>
  );
}
