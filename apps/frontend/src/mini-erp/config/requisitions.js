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
 *
 * i18n: labels are keyed through the ERP dictionary (`status.requisition.*`,
 * `requisitions.filters.*`, `requisitions.actions.*`, `requisitions.timeline.*`,
 * `toast.requisition*`). The static `label` fields hold the Spanish strings so
 * untouched call sites keep working; React call sites pass `te`:
 *
 *   const { te } = useErpTranslation();
 *   allowedActions(req, user, te)   // actions with localized labels/copy
 *   localizedReqFilters(te)         // filter tabs
 *   statusLabel(req.status, te)
 *   timelineSteps(req.status, te)
 */
import { userCan } from '../utils/permissions';
import { erpTranslations } from '../i18n/erpTranslations';

/** Spanish dictionary slice used as the non-localized fallback. */
const FALLBACK = erpTranslations.es;

export const REQ_STATUSES = [
  { value: 'pending', labelKey: 'status.requisition.pending', label: FALLBACK.status.requisition.pending, dot: 'bg-amber-500 dark:bg-amber-400' },
  { value: 'approved', labelKey: 'status.requisition.approved', label: FALLBACK.status.requisition.approved, dot: 'bg-blue-500 dark:bg-blue-400' },
  { value: 'completed', labelKey: 'status.requisition.completed', label: FALLBACK.status.requisition.completed, dot: 'bg-emerald-500 dark:bg-emerald-400' },
  { value: 'rejected', labelKey: 'status.requisition.rejected', label: FALLBACK.status.requisition.rejected, dot: 'bg-red-500 dark:bg-red-400' },
];

export const TERMINAL_STATUSES = ['completed', 'rejected'];

/**
 * Allowed transitions. Each action declares the status it may run **from**, the
 * permission that gates it, and UI metadata for the confirmation dialog.
 *
 * The `*Key` fields point at the dictionary; the plain fields are the Spanish
 * fallback. Use `localizedReqAction()` / `allowedActions(req, user, te)` to get
 * an action whose copy already follows the active language.
 */
export const REQ_ACTIONS = {
  approve: {
    key: 'approve',
    from: 'pending',
    permission: 'approveRequisition',
    label: FALLBACK.requisitions.actions.approve,
    labelKey: 'requisitions.actions.approve',
    intent: 'primary',
    confirmTitle: FALLBACK.requisitions.actions.approveTitle,
    confirmTitleKey: 'requisitions.actions.approveTitle',
    confirmBody: FALLBACK.requisitions.actions.approveBody,
    confirmBodyKey: 'requisitions.actions.approveBody',
    successMessage: FALLBACK.toast.requisitionApproved,
    successMessageKey: 'toast.requisitionApproved',
    requiresReason: false,
  },
  reject: {
    key: 'reject',
    from: 'pending',
    permission: 'rejectRequisition',
    label: FALLBACK.requisitions.actions.reject,
    labelKey: 'requisitions.actions.reject',
    intent: 'danger',
    confirmTitle: FALLBACK.requisitions.actions.rejectTitle,
    confirmTitleKey: 'requisitions.actions.rejectTitle',
    confirmBody: FALLBACK.requisitions.actions.rejectBody,
    confirmBodyKey: 'requisitions.actions.rejectBody',
    successMessage: FALLBACK.toast.requisitionRejected,
    successMessageKey: 'toast.requisitionRejected',
    requiresReason: true,
  },
  complete: {
    key: 'complete',
    from: 'approved',
    permission: 'completeRequisition',
    label: FALLBACK.requisitions.actions.complete,
    labelKey: 'requisitions.actions.complete',
    intent: 'success',
    confirmTitle: FALLBACK.requisitions.actions.completeTitle,
    confirmTitleKey: 'requisitions.actions.completeTitle',
    confirmBody: FALLBACK.requisitions.actions.completeBody,
    confirmBodyKey: 'requisitions.actions.completeBody',
    successMessage: FALLBACK.toast.requisitionCompleted,
    successMessageKey: 'toast.requisitionCompleted',
    requiresReason: false,
  },
};

/** Status filter tabs (the workflow stages + a catch-all "all"). */
export const REQ_FILTERS = [
  { value: 'all', labelKey: 'requisitions.filters.all', label: FALLBACK.requisitions.filters.all },
  { value: 'pending', labelKey: 'requisitions.filters.pending', label: FALLBACK.requisitions.filters.pending },
  { value: 'approved', labelKey: 'requisitions.filters.approved', label: FALLBACK.requisitions.filters.approved },
  { value: 'completed', labelKey: 'requisitions.filters.completed', label: FALLBACK.requisitions.filters.completed },
  { value: 'rejected', labelKey: 'requisitions.filters.rejected', label: FALLBACK.requisitions.filters.rejected },
];

/**
 * @param {string} status
 * @param {object} [te] dictionary from `useErpTranslation()`
 */
export function statusLabel(status, te) {
  const dictionary = te || FALLBACK;
  return dictionary.status?.requisition?.[status]
    || REQ_STATUSES.find((s) => s.value === status)?.label
    || status;
}

/** `REQ_STATUSES` with `label` resolved for the active language. */
export function localizedReqStatuses(te) {
  return REQ_STATUSES.map((status) => ({ ...status, label: statusLabel(status.value, te) }));
}

/** `REQ_FILTERS` with `label` resolved for the active language. */
export function localizedReqFilters(te) {
  const dictionary = te || FALLBACK;
  return REQ_FILTERS.map((filter) => ({
    ...filter,
    label: dictionary.requisitions?.filters?.[filter.value] || filter.label,
  }));
}

/** Success toast key per action, e.g. approve -> toast.requisitionApproved. */
const SUCCESS_TOAST_KEYS = {
  approve: 'requisitionApproved',
  reject: 'requisitionRejected',
  complete: 'requisitionCompleted',
};

/** One action with its label / confirmation copy / success toast localized. */
export function localizedReqAction(action, te) {
  if (!action) return action;
  const dictionary = te || FALLBACK;
  const actions = dictionary.requisitions?.actions;
  return {
    ...action,
    label: actions?.[action.key] || action.label,
    confirmTitle: actions?.[`${action.key}Title`] || action.confirmTitle,
    confirmBody: actions?.[`${action.key}Body`] || action.confirmBody,
    successMessage: dictionary.toast?.[SUCCESS_TOAST_KEYS[action.key]] || action.successMessage,
  };
}

/**
 * The actions a given user may perform on a requisition right now, gated by
 * both the current status (state machine) and the user role (permissions).
 *
 * @param {object} req
 * @param {object} user
 * @param {object} [te] pass it to get localized labels / confirmation copy
 */
export function allowedActions(req, user, te) {
  if (!req) return [];
  const actions = Object.values(REQ_ACTIONS).filter(
    (a) => req.status === a.from && userCan(user, a.permission)
  );
  return te ? actions.map((a) => localizedReqAction(a, te)) : actions;
}

/**
 * Progress steps for the status timeline / indicator. A rejected requisition
 * branches off the happy path.
 *
 * @param {string} status
 * @param {object} [te]
 */
export function timelineSteps(status, te) {
  const dictionary = te || FALLBACK;
  if (status === 'rejected') {
    return [
      {
        key: 'pending',
        label: dictionary.requisitions?.timeline?.created || FALLBACK.requisitions.timeline.created,
        state: 'done',
      },
      { key: 'rejected', label: statusLabel('rejected', te), state: 'rejected' },
    ];
  }
  const order = ['pending', 'approved', 'completed'];
  const current = order.indexOf(status);
  return order.map((key, i) => ({
    key,
    label: statusLabel(key, te),
    state: i < current ? 'done' : i === current ? 'current' : 'todo',
  }));
}

// Created items carry `productName`/`unit`; seed items carry `productId` only.
// Read both shapes defensively.
export function itemName(item, te) {
  return item.productName || item.productId || (te || FALLBACK).formats?.emptyValue || '-';
}

export function itemsTotal(req) {
  if (req?.totalEstimatedCost != null) return req.totalEstimatedCost;
  const items = Array.isArray(req?.items) ? req.items : [];
  return items.reduce((sum, it) => sum + (Number(it.estimatedCost) || 0), 0);
}

/** Priority accents readable on both a white and a near-black surface. */
export const PRIORITY_STYLES = {
  urgente: 'text-red-600 dark:text-red-400',
  alta: 'text-amber-600 dark:text-amber-400',
  media: 'text-muted-foreground',
  baja: 'text-muted-foreground',
};
