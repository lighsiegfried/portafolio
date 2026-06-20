/**
 * Requisition workflow configuration.
 *
 * This mirrors the backend state machine in
 * `apps/backend/src/modules/requisitions/handler.js` exactly:
 *
 *   pending  --approve-->  approved  --complete-->  completed
 *   pending  --reject--->  rejected
 *
 * `rejected` and `completed` are terminal. The frontend derives the available
 * actions from this single source so it can never offer a transition the
 * backend would reject (the backend still re-validates every transition).
 */
import { userCan } from '../utils/permissions';

export const REQ_STATUSES = [
  { value: 'pending', label: 'Pendiente', dot: 'bg-yellow-400' },
  { value: 'approved', label: 'Aprobada', dot: 'bg-blue-400' },
  { value: 'completed', label: 'Completada', dot: 'bg-emerald-400' },
  { value: 'rejected', label: 'Rechazada', dot: 'bg-red-400' },
];

export const TERMINAL_STATUSES = ['completed', 'rejected'];

/**
 * Allowed transitions. Each action declares the status it may run **from**, the
 * permission that gates it, and UI metadata for the confirmation dialog.
 */
export const REQ_ACTIONS = {
  approve: {
    key: 'approve',
    from: 'pending',
    permission: 'approveRequisition',
    label: 'Aprobar',
    intent: 'primary',
    confirmTitle: 'Aprobar requisición',
    confirmBody: 'La requisición pasará a estado "Aprobada" y podrá completarse.',
    successMessage: 'Requisición aprobada',
    requiresReason: false,
  },
  reject: {
    key: 'reject',
    from: 'pending',
    permission: 'rejectRequisition',
    label: 'Rechazar',
    intent: 'danger',
    confirmTitle: 'Rechazar requisición',
    confirmBody: 'La requisición quedará rechazada de forma definitiva. Indica el motivo.',
    successMessage: 'Requisición rechazada',
    requiresReason: true,
  },
  complete: {
    key: 'complete',
    from: 'approved',
    permission: 'completeRequisition',
    label: 'Completar',
    intent: 'success',
    confirmTitle: 'Completar requisición',
    confirmBody: 'La requisición se marcará como "Completada". Esta acción es definitiva.',
    successMessage: 'Requisición completada',
    requiresReason: false,
  },
};

/** Status filter tabs (the workflow stages + a catch-all "Todas"). */
export const REQ_FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'approved', label: 'Aprobadas' },
  { value: 'completed', label: 'Completadas' },
  { value: 'rejected', label: 'Rechazadas' },
];

export function statusLabel(status) {
  return REQ_STATUSES.find((s) => s.value === status)?.label || status;
}

/**
 * The actions a given user may perform on a requisition right now — gated by
 * both the current status (state machine) and the user's role (permissions).
 */
export function allowedActions(req, user) {
  if (!req) return [];
  return Object.values(REQ_ACTIONS).filter(
    (a) => req.status === a.from && userCan(user, a.permission)
  );
}

/**
 * Progress steps for the status timeline / indicator. A rejected requisition
 * branches off the happy path.
 */
export function timelineSteps(status) {
  if (status === 'rejected') {
    return [
      { key: 'pending', label: 'Creada', state: 'done' },
      { key: 'rejected', label: 'Rechazada', state: 'rejected' },
    ];
  }
  const order = ['pending', 'approved', 'completed'];
  const current = order.indexOf(status);
  return order.map((key, i) => ({
    key,
    label: statusLabel(key),
    state: i < current ? 'done' : i === current ? 'current' : 'todo',
  }));
}

// Created items carry `productName`/`unit`; seed items carry `productId` only.
// Read both shapes defensively.
export function itemName(item) {
  return item.productName || item.productId || '-';
}

export function itemsTotal(req) {
  if (req?.totalEstimatedCost != null) return req.totalEstimatedCost;
  const items = Array.isArray(req?.items) ? req.items : [];
  return items.reduce((sum, it) => sum + (Number(it.estimatedCost) || 0), 0);
}

export const PRIORITY_STYLES = {
  urgente: 'text-red-300',
  alta: 'text-yellow-300',
  media: 'text-muted-foreground',
  baja: 'text-muted-foreground',
};
