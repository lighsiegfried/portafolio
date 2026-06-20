import { Download, Loader2, Lock, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/mini-erp/components/ui/card';
import { Button } from '@/mini-erp/components/ui/button';
import { Badge } from '@/mini-erp/components/ui/badge';
import { cn } from '@/mini-erp/lib/utils';
import { REPORT_ACCENTS } from '../../config/reports';

/**
 * Report catalog card: title, description, the exact CSV columns it exports,
 * and a permission-aware export button with a per-card downloading state.
 */
export default function ReportCard({ report, permitted, downloading, onDownload }) {
  const Icon = report.icon || FileSpreadsheet;
  const tint = REPORT_ACCENTS[report.accent] || REPORT_ACCENTS.violet;

  return (
    <Card className={cn('flex flex-col transition-colors', !permitted && 'opacity-70')}>
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg', tint)}>
            <Icon className="size-5" />
          </div>
          <Badge variant="outline" className="gap-1 text-muted-foreground">
            <FileSpreadsheet className="size-3" />
            CSV
          </Badge>
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground">{report.title}</h3>
          <p className="text-sm text-muted-foreground">{report.description}</p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Columnas exportadas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {report.columns.map((col) => (
              <Badge key={col} variant="secondary" className="font-mono text-[10px] font-normal">
                {col}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          {permitted ? (
            <Button className="w-full" onClick={() => onDownload(report)} disabled={downloading}>
              {downloading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Descargando...
                </>
              ) : (
                <>
                  <Download className="size-4" />
                  Descargar CSV
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/30 py-2 text-xs text-muted-foreground">
              <Lock className="size-3.5" />
              Sin permiso para este reporte
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
