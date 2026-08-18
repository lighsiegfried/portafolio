/**
 * Compact metric card. `label` / `value` / `sub` are already-formatted strings
 * supplied by the caller, so there is nothing to translate here; the surface
 * and the type colors ride the ERP semantic tokens.
 */
export default function StatCard({ label, value, sub, accent }) {
  const accentColors = {
    violet: 'border-violet-500/30 dark:border-violet-500/20',
    blue: 'border-blue-500/30 dark:border-blue-500/20',
    green: 'border-green-500/30 dark:border-green-500/20',
    yellow: 'border-amber-500/30 dark:border-amber-500/20',
    red: 'border-red-500/30 dark:border-red-500/20',
    cyan: 'border-cyan-500/30 dark:border-cyan-500/20',
  };
  const borderColor = accentColors[accent] || accentColors.violet;
  return (
    <div className={`bg-[hsl(var(--card)/0.5)] backdrop-blur-sm border ${borderColor} rounded-xl p-5`}>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}
