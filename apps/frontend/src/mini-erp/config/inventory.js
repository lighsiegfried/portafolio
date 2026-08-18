/**
 * Inventory movement configuration. Movement types mirror the backend contract
 * (`apps/backend/src/modules/inventory/handler.js`): only 'IN' and 'OUT'.
 *
 * i18n: labels are keyed through the ERP dictionary
 * (`inventory.movementTypes.*`, `inventory.typeFilters.*`). The static `label`
 * fields hold the Spanish strings so untouched call sites keep working; React
 * call sites pass `te` from `useErpTranslation()`:
 *
 *   movementType('IN', te)                  // { value, label, badge }
 *   movementTypeLabel(movement.type, te)
 *   localizedMovementTypeFilters(te)
 */
import { erpTranslations } from '../i18n/erpTranslations';

/** Spanish dictionary slice used as the non-localized fallback. */
const FALLBACK = erpTranslations.es;

/** Badge accents readable on both a white and a near-black surface. */
export const MOVEMENT_TYPES = {
  IN: {
    value: 'IN',
    labelKey: 'inventory.movementTypes.IN',
    label: FALLBACK.inventory.movementTypes.IN,
    badge: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300',
  },
  OUT: {
    value: 'OUT',
    labelKey: 'inventory.movementTypes.OUT',
    label: FALLBACK.inventory.movementTypes.OUT,
    badge: 'bg-red-500/10 text-red-700 border-red-500/30 dark:bg-red-500/15 dark:text-red-300',
  },
};

export const MOVEMENT_TYPE_FILTERS = [
  { value: 'all', labelKey: 'inventory.typeFilters.all', label: FALLBACK.inventory.typeFilters.all },
  { value: 'IN', labelKey: 'inventory.typeFilters.in', label: FALLBACK.inventory.typeFilters.in },
  { value: 'OUT', labelKey: 'inventory.typeFilters.out', label: FALLBACK.inventory.typeFilters.out },
];

/**
 * @param {string} type 'IN' | 'OUT'
 * @param {object} [te] dictionary from `useErpTranslation()`
 */
export function movementTypeLabel(type, te) {
  const dictionary = te || FALLBACK;
  return dictionary.inventory?.movementTypes?.[type] || MOVEMENT_TYPES[type]?.label || type;
}

/** A movement type (value + badge classes) with its label localized. */
export function movementType(type, te) {
  const config = MOVEMENT_TYPES[type];
  if (!config) return config;
  return { ...config, label: movementTypeLabel(type, te) };
}

/** `MOVEMENT_TYPE_FILTERS` with `label` resolved for the active language. */
export function localizedMovementTypeFilters(te) {
  const dictionary = te || FALLBACK;
  const keys = { all: 'all', IN: 'in', OUT: 'out' };
  return MOVEMENT_TYPE_FILTERS.map((filter) => ({
    ...filter,
    label: dictionary.inventory?.typeFilters?.[keys[filter.value]] || filter.label,
  }));
}

/** Read the product label for a movement defensively (movements store productId). */
export function movementProductLabel(movement, productsById, te) {
  const product = productsById?.[movement.productId];
  if (product) return `${product.sku} · ${product.name}`;
  if (movement.productId) return movement.productId.slice(0, 8);
  return (te || FALLBACK).formats?.emptyValue || '-';
}
