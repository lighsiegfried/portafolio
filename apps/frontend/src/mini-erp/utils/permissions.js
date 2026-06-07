const RULES = {
  createRequisition: { roles: ['admin', 'compras'] },
  approveRequisition: { roles: ['admin', 'gerencia'] },
  rejectRequisition: { roles: ['admin', 'gerencia'] },
  completeRequisition: { roles: ['admin', 'compras'] },
  createProduct: { roles: ['admin'] },
  updateProduct: { roles: ['admin'] },
  updateStock: { roles: ['admin', 'bodega'] },
  createMovement: { roles: ['admin', 'bodega'] },
  viewInventory: { roles: ['admin', 'bodega'] },
  viewLeads: { roles: ['admin', 'gerencia'] },
  manageLeads: { roles: ['admin', 'gerencia'] },
  downloadRequisitionsCsv: { roles: ['admin', 'compras', 'gerencia'] },
  downloadInventoryCsv: { roles: ['admin', 'bodega', 'gerencia'] },
  downloadLeadsCsv: { roles: ['admin', 'gerencia'] },
};

export function can(role, action) {
  const rule = RULES[action];
  if (!rule) return false;
  return rule.roles.includes(role);
}

export function userCan(user, action) {
  if (!user) return false;
  return can(user.role, action);
}
