const mockDb = require('../data/mock-db');
const bcrypt = require('bcryptjs');
const { generateId, generateRequisitionNumber } = require('../utils/idGenerator');

function findUserByUsername(username) {
  return mockDb.users.find((u) => u.username === username && u.active) || null;
}

function findUserById(id) {
  return mockDb.users.find((u) => u.id === id) || null;
}

function verifyPassword(plain, hash) {
  if (!plain || !hash) {
    return false;
  }
  return bcrypt.compareSync(plain, hash);
}

function listRequisitions() {
  return mockDb.requisitions.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function findRequisitionById(id) {
  return mockDb.requisitions.find((r) => r.id === id) || null;
}

function createRequisition(data) {
  const now = new Date().toISOString();
  const requisition = {
    id: generateId(),
    number: generateRequisitionNumber(),
    title: data.title,
    description: data.description || null,
    status: 'pending',
    rejectionReason: null,
    createdBy: data.createdBy,
    approvedBy: null,
    completedBy: null,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  mockDb.requisitions.push(requisition);
  return requisition;
}

function updateRequisition(id, updates) {
  const idx = mockDb.requisitions.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  const updated = { ...mockDb.requisitions[idx], ...updates, updatedAt: new Date().toISOString() };
  mockDb.requisitions[idx] = updated;
  return updated;
}

function listProducts() {
  return mockDb.products.slice().sort((a, b) => a.name.localeCompare(b.name));
}

function findProductById(id) {
  return mockDb.products.find((p) => p.id === id) || null;
}

function listInventoryMovements() {
  return mockDb.inventoryMovements.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function listLowStockProducts(threshold) {
  return mockDb.products.filter((p) => p.stock <= threshold);
}

function listLeads() {
  return mockDb.leads.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function findLeadById(id) {
  return mockDb.leads.find((l) => l.id === id) || null;
}

function getDashboardSummary() {
  const totalProducts = mockDb.products.length;
  const totalRequisitions = mockDb.requisitions.length;
  const pendingRequisitions = mockDb.requisitions.filter((r) => r.status === 'pending').length;
  const totalLeads = mockDb.leads.length;
  const leadsByStatus = {
    new: mockDb.leads.filter((l) => l.status === 'new').length,
    in_contact: mockDb.leads.filter((l) => l.status === 'in_contact').length,
    negotiation: mockDb.leads.filter((l) => l.status === 'negotiation').length,
  };
  const lowStockCount = mockDb.products.filter((p) => p.stock <= p.minStock).length;
  const totalInventoryValue = mockDb.products.reduce((sum, p) => sum + p.stock * p.price, 0);

  return {
    totalProducts,
    totalRequisitions,
    pendingRequisitions,
    totalLeads,
    leadsByStatus,
    lowStockCount,
    totalInventoryValue,
  };
}

function getRequisitionItems(requisitionId) {
  return mockDb.requisitionItems.filter((i) => i.requisitionId === requisitionId);
}

function getLeadNotes(leadId) {
  return mockDb.leadNotes.filter((n) => n.leadId === leadId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getAuditEvents() {
  return mockDb.auditEvents.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function findProductBySku(sku) {
  return mockDb.products.find((p) => p.sku === sku) || null;
}

function createProduct(data) {
  const now = new Date().toISOString();
  const product = {
    id: generateId(),
    sku: data.sku,
    name: data.name,
    description: data.description || null,
    category: data.category,
    stock: data.initialStock != null ? data.initialStock : 0,
    minStock: data.minStock,
    unit: data.unit,
    price: data.price,
    active: true,
    createdAt: now,
    updatedAt: now,
  };
  mockDb.products.push(product);
  return product;
}

function updateProduct(id, data) {
  const idx = mockDb.products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const allowed = { ...data };
  delete allowed.id;
  delete allowed.createdAt;
  const updated = { ...mockDb.products[idx], ...allowed, updatedAt: new Date().toISOString() };
  mockDb.products[idx] = updated;
  return updated;
}

function createInventoryMovement(data) {
  const now = new Date().toISOString();
  const movement = {
    id: generateId(),
    productId: data.productId,
    type: data.type,
    quantity: data.quantity,
    stockBefore: data.stockBefore,
    stockAfter: data.stockAfter,
    reference: data.reference,
    notes: data.notes || null,
    createdBy: data.createdBy,
    createdAt: now,
  };
  mockDb.inventoryMovements.push(movement);
  return movement;
}

function updateProductStock(id, newStock) {
  const idx = mockDb.products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  mockDb.products[idx] = { ...mockDb.products[idx], stock: newStock, updatedAt: new Date().toISOString() };
  return mockDb.products[idx];
}

function createLead(data) {
  const now = new Date().toISOString();
  const lead = {
    id: generateId(),
    companyName: data.companyName,
    contactName: data.contactName,
    email: data.email,
    phone: data.phone,
    status: 'new',
    source: data.source,
    nextFollowUp: data.nextFollowUp || null,
    assignedTo: data.assignedTo || null,
    notes: data.notes || null,
    createdAt: now,
    updatedAt: now,
  };
  mockDb.leads.push(lead);
  return lead;
}

function updateLead(id, data) {
  const idx = mockDb.leads.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  const allowed = { ...data };
  delete allowed.id;
  delete allowed.createdAt;
  const updated = { ...mockDb.leads[idx], ...allowed, updatedAt: new Date().toISOString() };
  mockDb.leads[idx] = updated;
  return updated;
}

function addLeadNote(data) {
  const note = {
    id: generateId(),
    leadId: data.leadId,
    content: data.content,
    createdBy: data.createdBy,
    createdAt: new Date().toISOString(),
  };
  mockDb.leadNotes.push(note);
  return note;
}

function createRequisitionItem(data) {
  const item = {
    id: generateId(),
    requisitionId: data.requisitionId,
    productName: data.productName,
    quantity: data.quantity,
    unit: data.unit,
    estimatedCost: data.estimatedCost,
    observations: data.observations || null,
  };
  mockDb.requisitionItems.push(item);
  return item;
}

function getDb() {
  return mockDb;
}

const COLLECTION_MAP = {
  users: 'users',
  products: 'products',
  requisitions: 'requisitions',
  requisitionItems: 'requisitionItems',
  inventoryMovements: 'inventoryMovements',
  leads: 'leads',
  leadNotes: 'leadNotes',
  auditEvents: 'auditEvents',
  contactMessages: 'contactMessages',
};

function getCollectionArray(collection) {
  const key = COLLECTION_MAP[collection];
  if (!key) throw new Error(`Colección desconocida: ${collection}`);
  if (!Array.isArray(mockDb[key])) throw new Error(`La colección '${collection}' no es un arreglo`);
  return mockDb[key];
}

function slugSortKey(collection) {
  if (collection === 'users') return (a, b) => a.username.localeCompare(b.username);
  if (collection === 'products') return (a, b) => a.name.localeCompare(b.name);
  return (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
}

function list(collection, options = {}) {
  const arr = getCollectionArray(collection);
  let items = arr.slice().sort(slugSortKey(collection));
  const limit = Math.min(parseInt(options.limit, 10) || 50, 100);
  const offset = parseInt(options.offset, 10) || 0;

  const totalBeforePagination = items.length;
  items = items.slice(offset, offset + limit);

  let nextToken = null;
  if (offset + limit < totalBeforePagination) {
    nextToken = `offset_${offset + limit}`;
  }

  return { items, nextToken };
}

function findById(collection, id) {
  const arr = getCollectionArray(collection);
  return arr.find((item) => item.id === id) || null;
}

function findOneBy(collection, field, value) {
  const arr = getCollectionArray(collection);
  return arr.find((item) => item[field] === value) || null;
}

function create(collection, payload) {
  const arr = getCollectionArray(collection);
  const now = new Date().toISOString();
  const item = {
    ...payload,
    id: payload.id || generateId(),
    createdAt: payload.createdAt || now,
    updatedAt: payload.updatedAt || now,
  };
  arr.push(item);
  return item;
}

function update(collection, id, payload) {
  const arr = getCollectionArray(collection);
  const idx = arr.findIndex((item) => item.id === id);
  if (idx === -1) return null;
  const allowed = { ...payload };
  delete allowed.id;
  delete allowed.createdAt;
  const updated = { ...arr[idx], ...allowed, updatedAt: new Date().toISOString() };
  arr[idx] = updated;
  return updated;
}

function remove(collection, id) {
  const arr = getCollectionArray(collection);
  const idx = arr.findIndex((item) => item.id === id);
  if (idx === -1) return null;
  const removed = arr.splice(idx, 1)[0];
  return removed;
}

function queryBy(collection, field, value, options = {}) {
  const arr = getCollectionArray(collection);
  let items = arr.filter((item) => item[field] === value).sort(slugSortKey(collection));
  const limit = Math.min(parseInt(options.limit, 10) || 50, 100);
  const offset = parseInt(options.offset, 10) || 0;

  const totalBeforePagination = items.length;
  items = items.slice(offset, offset + limit);

  let nextToken = null;
  if (offset + limit < totalBeforePagination) {
    nextToken = `offset_${offset + limit}`;
  }

  return { items, nextToken };
}

module.exports = {
  list,
  findById,
  findOneBy,
  create,
  update,
  remove,
  queryBy,
  findUserByUsername,
  findUserById,
  verifyPassword,
  listRequisitions,
  findRequisitionById,
  createRequisition,
  updateRequisition,
  listProducts,
  findProductById,
  findProductBySku,
  createProduct,
  updateProduct,
  listInventoryMovements,
  createInventoryMovement,
  updateProductStock,
  listLowStockProducts,
  listLeads,
  findLeadById,
  createLead,
  updateLead,
  addLeadNote,
  getDashboardSummary,
  getRequisitionItems,
  createRequisitionItem,
  getLeadNotes,
  getAuditEvents,
  getDb,
};
