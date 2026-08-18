import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import useErpTranslation from '../i18n/useErpTranslation';

export default function DataTable({ columns, data, loading, error, onRetry, emptyMessage }) {
  const { te } = useErpTranslation();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!data || data.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th key={col.key} className={`text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider ${col.className || ''}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i} className="border-b border-border/60 hover:bg-muted/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className={`py-3 px-3 text-foreground ${col.className || ''}`}>
                  {col.render ? col.render(row) : row[col.key] ?? te.formats.emptyValue}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
