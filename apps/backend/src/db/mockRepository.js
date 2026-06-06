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

module.exports = {
  findUserByUsername,
  findUserById,
  verifyPassword,
  listRequisitions,
  findRequisitionById,
  createRequisition,
  updateRequisition,
  listProducts,
  findProductById,
  listInventoryMovements,
  listLowStockProducts,
  listLeads,
  findLeadById,
  getDashboardSummary,
  getRequisitionItems,
  getLeadNotes,
  getAuditEvents,
};
