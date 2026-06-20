/**
 * Inventory movement configuration. Movement types mirror the backend contract
 * (`apps/backend/src/modules/inventory/handler.js`): only 'IN' and 'OUT'.
 */
export const MOVEMENT_TYPES = {
  IN: { value: 'IN', label: 'Entrada', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  OUT: { value: 'OUT', label: 'Salida', badge: 'bg-red-500/15 text-red-300 border-red-500/30' },
};

export const MOVEMENT_TYPE_FILTERS = [
  { value: 'all', label: 'Todos' },
  { value: 'IN', label: 'Entradas' },
  { value: 'OUT', label: 'Salidas' },
];

export function movementTypeLabel(type) {
  return MOVEMENT_TYPES[type]?.label || type;
}

/** Read the product label for a movement defensively (movements store productId). */
export function movementProductLabel(movement, productsById) {
  const product = productsById?.[movement.productId];
  if (product) return `${product.sku} · ${product.name}`;
  return movement.productId ? movement.productId.slice(0, 8) : '-';
}
