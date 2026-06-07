export function formatDate(iso) {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleDateString('es-MX', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch { return iso; }
}

export function formatDateTime(iso) {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString('es-MX', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
}

export function formatCurrency(n) {
  if (n == null) return '-';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN',
  }).format(n);
}

export function formatNumber(n) {
  if (n == null) return '-';
  return new Intl.NumberFormat('es-MX').format(n);
}

export function statusLabel(status) {
  const map = {
    pending: 'Pendiente', approved: 'Aprobada', rejected: 'Rechazada', completed: 'Completada',
    new: 'Nuevo', in_contact: 'En contacto', negotiation: 'Negociación', won: 'Ganado', lost: 'Perdido',
  };
  return map[status] || status;
}
