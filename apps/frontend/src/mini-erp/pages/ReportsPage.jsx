import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { userCan } from '../utils/permissions';
import ReportCard from '../components/data-display/ReportCard';
import EmptyState from '../components/EmptyState';
import { REPORTS } from '../config/reports';

export default function ReportsPage() {
  const { user } = useAuth();
  const [downloadingKey, setDownloadingKey] = useState(null);

  const permittedReports = useMemo(
    () => REPORTS.map((r) => ({ report: r, permitted: userCan(user, r.permission) })),
    [user]
  );
  const permittedCount = permittedReports.filter((r) => r.permitted).length;

  async function handleDownload(report) {
    setDownloadingKey(report.key);
    const toastId = toast.loading(`Generando ${report.title}...`);
    try {
      const blob = await report.download();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = report.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success(`${report.title} exportado`, { id: toastId, description: report.filename });
    } catch (err) {
      toast.error(`Error al exportar ${report.title}`, {
        id: toastId,
        description: err.message || 'Intenta nuevamente.',
      });
    } finally {
      setDownloadingKey(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Exporta los datos del ERP a CSV para análisis en Excel, Google Sheets o cualquier herramienta de BI.
        </p>
      </div>

      {permittedCount === 0 ? (
        <div className="erp-surface-card rounded-xl p-6">
          <EmptyState message="No tienes permisos para exportar reportes. Contacta a un administrador." />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {permittedReports.map(({ report, permitted }) => (
            <ReportCard
              key={report.key}
              report={report}
              permitted={permitted}
              downloading={downloadingKey === report.key}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}

      <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-muted/30 p-4 text-sm text-muted-foreground">
        <FileSpreadsheet className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <p>
          Los reportes se generan en el servidor con los datos actuales del sistema. Cada archivo CSV incluye
          únicamente las columnas indicadas y puede abrirse directamente en cualquier hoja de cálculo.
        </p>
      </div>
    </div>
  );
}
