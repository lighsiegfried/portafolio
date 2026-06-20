/**
 * Lead pipeline configuration. Preserves the backend's 5 states
 * (apps/backend/src/modules/leads/handler.js → VALID_STATUSES).
 */
export const LEAD_STAGES = [
  { status: 'new', label: 'Nuevo', dot: 'bg-cyan-400' },
  { status: 'in_contact', label: 'En contacto', dot: 'bg-indigo-400' },
  { status: 'negotiation', label: 'Negociación', dot: 'bg-purple-400' },
  { status: 'won', label: 'Ganado', dot: 'bg-emerald-400' },
  { status: 'lost', label: 'Perdido', dot: 'bg-gray-400' },
];

export const LEAD_STATUSES = LEAD_STAGES.map((s) => s.status);

export const LEAD_SOURCES = [
  { value: 'web', label: 'Web' },
  { value: 'referencia', label: 'Referencia' },
  { value: 'llamada', label: 'Llamada' },
  { value: 'otro', label: 'Otro' },
];

export function stageLabel(status) {
  const found = LEAD_STAGES.find((s) => s.status === status);
  return found ? found.label : status;
}

export function sourceLabel(value) {
  const found = LEAD_SOURCES.find((s) => s.value === value);
  return found ? found.label : value || '-';
}

// The seed data uses company/name; the API create/update uses companyName/contactName.
// Read both shapes everywhere in the UI.
export function leadCompany(lead) {
  return lead.companyName || lead.company || '-';
}

export function leadContact(lead) {
  return lead.contactName || lead.name || '-';
}

export function isFollowUpOverdue(lead) {
  if (!lead.nextFollowUp) return false;
  if (lead.status === 'won' || lead.status === 'lost') return false;
  const due = new Date(lead.nextFollowUp);
  if (Number.isNaN(due.getTime())) return false;
  return due < new Date();
}
