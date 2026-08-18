/**
 * Lead pipeline configuration. Preserves the backend's 5 states
 * (apps/backend/src/modules/leads/handler.js → VALID_STATUSES).
 *
 * i18n: every user-visible label is keyed through the ERP dictionary
 * (`status.lead.*`, `leads.sources.*`). The `label` field stays populated with
 * the Spanish string so existing call sites keep rendering, but React call
 * sites should pass the `te` object from `useErpTranslation()`:
 *
 *   const { te } = useErpTranslation();
 *   const stages = localizedLeadStages(te);   // instead of LEAD_STAGES
 *   stageLabel(lead.status, te);
 *   sourceLabel(lead.source, te);
 */
import { erpTranslations } from '../i18n/erpTranslations';

/** Spanish dictionary slice used as the non-localized fallback. */
const FALLBACK = erpTranslations.es;

export const LEAD_STAGES = [
  { status: 'new', labelKey: 'status.lead.new', label: FALLBACK.status.lead.new, dot: 'bg-cyan-500 dark:bg-cyan-400' },
  { status: 'in_contact', labelKey: 'status.lead.in_contact', label: FALLBACK.status.lead.in_contact, dot: 'bg-indigo-500 dark:bg-indigo-400' },
  { status: 'negotiation', labelKey: 'status.lead.negotiation', label: FALLBACK.status.lead.negotiation, dot: 'bg-purple-500 dark:bg-purple-400' },
  { status: 'won', labelKey: 'status.lead.won', label: FALLBACK.status.lead.won, dot: 'bg-emerald-500 dark:bg-emerald-400' },
  { status: 'lost', labelKey: 'status.lead.lost', label: FALLBACK.status.lead.lost, dot: 'bg-gray-500 dark:bg-gray-400' },
];

export const LEAD_STATUSES = LEAD_STAGES.map((s) => s.status);

export const LEAD_SOURCES = [
  { value: 'web', labelKey: 'leads.sources.web', label: FALLBACK.leads.sources.web },
  { value: 'referencia', labelKey: 'leads.sources.referencia', label: FALLBACK.leads.sources.referencia },
  { value: 'llamada', labelKey: 'leads.sources.llamada', label: FALLBACK.leads.sources.llamada },
  { value: 'otro', labelKey: 'leads.sources.otro', label: FALLBACK.leads.sources.otro },
];

/**
 * @param {string} status
 * @param {object} [te] — dictionary from `useErpTranslation()`.
 */
export function stageLabel(status, te) {
  const dictionary = te || FALLBACK;
  return dictionary.status?.lead?.[status] || LEAD_STAGES.find((s) => s.status === status)?.label || status;
}

/**
 * @param {string} value
 * @param {object} [te]
 */
export function sourceLabel(value, te) {
  const dictionary = te || FALLBACK;
  if (!value) return dictionary.formats?.emptyValue || '-';
  return dictionary.leads?.sources?.[value] || LEAD_SOURCES.find((s) => s.value === value)?.label || value;
}

/** `LEAD_STAGES` with `label` resolved for the active language. */
export function localizedLeadStages(te) {
  return LEAD_STAGES.map((stage) => ({ ...stage, label: stageLabel(stage.status, te) }));
}

/** `LEAD_SOURCES` with `label` resolved for the active language. */
export function localizedLeadSources(te) {
  return LEAD_SOURCES.map((source) => ({ ...source, label: sourceLabel(source.value, te) }));
}

// The seed data uses company/name; the API create/update uses companyName/contactName.
// Read both shapes everywhere in the UI.
export function leadCompany(lead, te) {
  return lead.companyName || lead.company || (te || FALLBACK).formats?.emptyValue || '-';
}

export function leadContact(lead, te) {
  return lead.contactName || lead.name || (te || FALLBACK).formats?.emptyValue || '-';
}

export function isFollowUpOverdue(lead) {
  if (!lead.nextFollowUp) return false;
  if (lead.status === 'won' || lead.status === 'lost') return false;
  const due = new Date(lead.nextFollowUp);
  if (Number.isNaN(due.getTime())) return false;
  return due < new Date();
}
