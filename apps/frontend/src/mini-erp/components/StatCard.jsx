export default function StatCard({ label, value, sub, accent }) {
  const accentColors = {
    violet: 'border-violet-500/20',
    blue: 'border-blue-500/20',
    green: 'border-green-500/20',
    yellow: 'border-yellow-500/20',
    red: 'border-red-500/20',
    cyan: 'border-cyan-500/20',
  };
  const borderColor = accentColors[accent] || accentColors.violet;
  return (
    <div className={`bg-tertiary/50 backdrop-blur-sm border ${borderColor} rounded-xl p-5`}>
      <p className="text-xs text-secondary uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-secondary mt-1">{sub}</p>}
    </div>
  );
}
