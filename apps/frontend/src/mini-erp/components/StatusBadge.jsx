const STYLES = {
  pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  approved: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
  completed: 'bg-green-500/20 text-green-300 border-green-500/30',
  new: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  in_contact: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  negotiation: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  won: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  lost: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

const LABELS = {
  pending: 'Pendiente', approved: 'Aprobada', rejected: 'Rechazada', completed: 'Completada',
  new: 'Nuevo', in_contact: 'En contacto', negotiation: 'Negociacion', won: 'Ganado', lost: 'Perdido',
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  const label = LABELS[status] || status;
  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border ${style}`}>
      {label}
    </span>
  );
}
