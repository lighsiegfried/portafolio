import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useErpTranslation from '../i18n/useErpTranslation';
import { userCan } from '../utils/permissions';
import ReportCard from '../components/data-display/ReportCard';
import EmptyState from '../components/EmptyState';
import { REPORTS } from '../config/reports';

export default function ReportsPage() {
  const { user } = useAuth();
  const { te } = useErpTranslation();
  const [downloadingKey, setDownloadingKey] = useState(null);

  const permittedReports = useMemo(
    () => REPORTS.map((r) => ({ report: r, permitted: userCan(user, r.permission) })),
    [user]
  );
  const permittedCount = permittedReports.filter((r) => r.permitted).length;

  async function handleDownload(report) {
    const reportName = te.reports.catalog[report.key]?.title ?? report.title;
    setDownloadingKey(report.key);
    const toastId = toast.loading(te.toast.reportGenerating.replace('{report}', reportName));
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
      toast.success(te.toast.reportExported.replace('{report}', reportName), { id: toastId, description: report.filename });
    } catch (err) {
      toast.error(te.toast.reportError.replace('{report}', reportName), {
        id: toastId,
        description: err.message || te.toast.reportErrorDescription,
      });
    } finally {
      setDownloadingKey(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{te.reports.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{te.reports.subtitle}</p>
      </div>

      {permittedCount === 0 ? (
        <div className="erp-surface-card rounded-xl p-6">
          <EmptyState message={te.reports.noPermission} />
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

      <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <FileSpreadsheet aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <p>{te.reports.footnote}</p>
      </div>
    </div>
  );
}
