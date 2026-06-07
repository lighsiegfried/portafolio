const VALID_REQUISITION_STATUSES = ['pending', 'approved', 'rejected', 'completed'];
const VALID_LEAD_STATUSES = ['new', 'in_contact', 'negotiation', 'won', 'lost'];
const VALID_SOURCES = ['web', 'referencia', 'llamada', 'otro'];
const VALID_ROLES = ['admin', 'compras', 'bodega', 'gerencia'];
const VALID_CATEGORIES = ['insumo', 'materia_prima', 'equipo', 'servicio', 'oficina'];
const VALID_MOVEMENT_TYPES = ['IN', 'OUT'];

function isValidUUID(str) {
  return typeof str === 'string' && /^[0-9a-f-]{36}$/.test(str);
}

function isValidISO(str) {
  return typeof str === 'string' && !isNaN(Date.parse(str));
}

function validateSeedData(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return [{ type: 'STRUCTURE', message: 'data debe ser un objeto' }];
  }

  const { users, products, requisitions, requisitionItems, inventoryMovements, leads, leadNotes, auditEvents } = data;

  const ids = {};
  function trackIds(arr, type) {
    if (!Array.isArray(arr)) {
      errors.push({ type: 'STRUCTURE', entity: type, message: `${type} no es un arreglo` });
      return;
    }
    arr.forEach((item) => {
      if (item && item.id) {
        ids[item.id] = type;
      }
    });
  }

  trackIds(users, 'user');
  trackIds(products, 'product');
  trackIds(requisitions, 'requisition');
  trackIds(leads, 'lead');

  function idExists(id, expectedType) {
    if (!id) return false;
    const actualType = ids[id];
    if (!actualType) return false;
    if (expectedType && actualType !== expectedType) return false;
    return true;
  }

  if (!users || !Array.isArray(users)) {
    errors.push({ type: 'STRUCTURE', message: 'users debe ser un arreglo' });
  } else {
    const usernames = new Set();
    users.forEach((u, i) => {
      if (!u.username) errors.push({ type: 'MISSING_FIELD', entity: 'user', index: i, field: 'username' });
      if (u.username && usernames.has(u.username)) errors.push({ type: 'DUPLICATE', entity: 'user', message: `Username duplicado: ${u.username}` });
      if (u.username) usernames.add(u.username);
      if (!u.role || !VALID_ROLES.includes(u.role)) errors.push({ type: 'INVALID', entity: 'user', index: i, field: 'role', value: u.role });
      if (!u.passwordHash || !u.passwordHash.startsWith('$2a$')) errors.push({ type: 'INVALID', entity: 'user', index: i, field: 'passwordHash', message: 'passwordHash debe ser bcrypt' });
      if (!u.id || !isValidUUID(u.id)) errors.push({ type: 'INVALID', entity: 'user', index: i, field: 'id', value: u.id });
      if (u.createdAt && !isValidISO(u.createdAt)) errors.push({ type: 'INVALID_DATE', entity: 'user', index: i, field: 'createdAt' });
    });
  }

  if (!products || !Array.isArray(products)) {
    errors.push({ type: 'STRUCTURE', message: 'products debe ser un arreglo' });
  } else {
    const skus = new Set();
    products.forEach((p, i) => {
      if (!p.id || !isValidUUID(p.id)) errors.push({ type: 'INVALID', entity: 'product', index: i, field: 'id', value: p.id });
      if (!p.sku) errors.push({ type: 'MISSING_FIELD', entity: 'product', index: i, field: 'sku' });
      if (p.sku && skus.has(p.sku)) errors.push({ type: 'DUPLICATE', entity: 'product', message: `SKU duplicado: ${p.sku}` });
      if (p.sku) skus.add(p.sku);
      if (p.stock != null && p.stock < 0) errors.push({ type: 'INVALID', entity: 'product', index: i, field: 'stock', value: p.stock, message: 'Stock no puede ser negativo' });
      if (p.category && !VALID_CATEGORIES.includes(p.category)) errors.push({ type: 'INVALID', entity: 'product', index: i, field: 'category', value: p.category });
      if (p.updatedAt && !isValidISO(p.updatedAt)) errors.push({ type: 'INVALID_DATE', entity: 'product', index: i, field: 'updatedAt' });
    });
  }

  if (!requisitions || !Array.isArray(requisitions)) {
    errors.push({ type: 'STRUCTURE', message: 'requisitions debe ser un arreglo' });
  } else {
    const reqNumbers = new Set();
    requisitions.forEach((r, i) => {
      if (!r.id || !isValidUUID(r.id)) errors.push({ type: 'INVALID', entity: 'requisition', index: i, field: 'id', value: r.id });
      if (r.number && reqNumbers.has(r.number)) errors.push({ type: 'DUPLICATE', entity: 'requisition', message: `Número duplicado: ${r.number}` });
      if (r.number) reqNumbers.add(r.number);
      if (r.status && !VALID_REQUISITION_STATUSES.includes(r.status)) errors.push({ type: 'INVALID', entity: 'requisition', index: i, field: 'status', value: r.status });
      if (r.createdBy && !idExists(r.createdBy, 'user')) errors.push({ type: 'INVALID_REFERENCE', entity: 'requisition', index: i, field: 'createdBy', value: r.createdBy });
      if (r.approvedBy && !idExists(r.approvedBy, 'user')) errors.push({ type: 'INVALID_REFERENCE', entity: 'requisition', index: i, field: 'approvedBy', value: r.approvedBy });
      if (r.completedBy && !idExists(r.completedBy, 'user')) errors.push({ type: 'INVALID_REFERENCE', entity: 'requisition', index: i, field: 'completedBy', value: r.completedBy });
      if (r.status === 'rejected' && !r.rejectionReason) errors.push({ type: 'MISSING_FIELD', entity: 'requisition', index: i, field: 'rejectionReason', message: 'Requisición rechazada debe tener rejectionReason' });
      if (r.createdAt && !isValidISO(r.createdAt)) errors.push({ type: 'INVALID_DATE', entity: 'requisition', index: i, field: 'createdAt' });
    });
  }

  if (!requisitionItems || !Array.isArray(requisitionItems)) {
    errors.push({ type: 'STRUCTURE', message: 'requisitionItems debe ser un arreglo' });
  } else {
    requisitionItems.forEach((item, i) => {
      if (!item.id || !isValidUUID(item.id)) errors.push({ type: 'INVALID', entity: 'requisitionItem', index: i, field: 'id', value: item.id });
      if (item.requisitionId && !idExists(item.requisitionId, 'requisition')) errors.push({ type: 'INVALID_REFERENCE', entity: 'requisitionItem', index: i, field: 'requisitionId', value: item.requisitionId });
      if (item.quantity != null && item.quantity <= 0) errors.push({ type: 'INVALID', entity: 'requisitionItem', index: i, field: 'quantity', value: item.quantity });
      if (item.estimatedCost != null && item.estimatedCost < 0) errors.push({ type: 'INVALID', entity: 'requisitionItem', index: i, field: 'estimatedCost', value: item.estimatedCost });
    });
  }

  if (!inventoryMovements || !Array.isArray(inventoryMovements)) {
    errors.push({ type: 'STRUCTURE', message: 'inventoryMovements debe ser un arreglo' });
  } else {
    inventoryMovements.forEach((m, i) => {
      if (!m.id || !isValidUUID(m.id)) errors.push({ type: 'INVALID', entity: 'inventoryMovement', index: i, field: 'id', value: m.id });
      if (m.productId && !idExists(m.productId, 'product')) errors.push({ type: 'INVALID_REFERENCE', entity: 'inventoryMovement', index: i, field: 'productId', value: m.productId });
      if (m.type && !VALID_MOVEMENT_TYPES.includes(m.type)) errors.push({ type: 'INVALID', entity: 'inventoryMovement', index: i, field: 'type', value: m.type });
      if (m.quantity != null && m.quantity <= 0) errors.push({ type: 'INVALID', entity: 'inventoryMovement', index: i, field: 'quantity', value: m.quantity });
      if (m.stockBefore != null && m.stockBefore < 0) errors.push({ type: 'INVALID', entity: 'inventoryMovement', index: i, field: 'stockBefore', value: m.stockBefore });
      if (m.stockAfter != null && m.stockAfter < 0) errors.push({ type: 'INVALID', entity: 'inventoryMovement', index: i, field: 'stockAfter', value: m.stockAfter });
      if (m.createdBy && !idExists(m.createdBy, 'user')) errors.push({ type: 'INVALID_REFERENCE', entity: 'inventoryMovement', index: i, field: 'createdBy', value: m.createdBy });
    });
  }

  if (!leads || !Array.isArray(leads)) {
    errors.push({ type: 'STRUCTURE', message: 'leads debe ser un arreglo' });
  } else {
    leads.forEach((l, i) => {
      if (!l.id || !isValidUUID(l.id)) errors.push({ type: 'INVALID', entity: 'lead', index: i, field: 'id', value: l.id });
      if (l.status && !VALID_LEAD_STATUSES.includes(l.status)) errors.push({ type: 'INVALID', entity: 'lead', index: i, field: 'status', value: l.status });
      if (l.source && !VALID_SOURCES.includes(l.source)) errors.push({ type: 'INVALID', entity: 'lead', index: i, field: 'source', value: l.source });
      if (l.assignedTo && !idExists(l.assignedTo, 'user')) errors.push({ type: 'INVALID_REFERENCE', entity: 'lead', index: i, field: 'assignedTo', value: l.assignedTo });
      if (l.nextFollowUp && !isValidISO(l.nextFollowUp)) errors.push({ type: 'INVALID_DATE', entity: 'lead', index: i, field: 'nextFollowUp' });
    });
  }

  if (!leadNotes || !Array.isArray(leadNotes)) {
    errors.push({ type: 'STRUCTURE', message: 'leadNotes debe ser un arreglo' });
  } else {
    leadNotes.forEach((n, i) => {
      if (!n.id || !isValidUUID(n.id)) errors.push({ type: 'INVALID', entity: 'leadNote', index: i, field: 'id', value: n.id });
      if (n.leadId && !idExists(n.leadId, 'lead')) errors.push({ type: 'INVALID_REFERENCE', entity: 'leadNote', index: i, field: 'leadId', value: n.leadId });
      if (!n.content) errors.push({ type: 'MISSING_FIELD', entity: 'leadNote', index: i, field: 'content' });
    });
  }

  if (!auditEvents || !Array.isArray(auditEvents)) {
    errors.push({ type: 'STRUCTURE', message: 'auditEvents debe ser un arreglo' });
  }

  return errors;
}

module.exports = { validateSeedData, VALID_REQUISITION_STATUSES, VALID_LEAD_STATUSES, VALID_ROLES, VALID_CATEGORIES };
