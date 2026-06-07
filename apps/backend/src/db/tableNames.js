const config = require('../config');

const COLLECTIONS = {
  users: 'users',
  products: 'products',
  requisitions: 'requisitions',
  requisitionItems: 'requisition-items',
  inventoryMovements: 'inventory-movements',
  leads: 'leads',
  leadNotes: 'lead-notes',
  auditEvents: 'audit-events',
};

function tableName(collection) {
  const suffix = COLLECTIONS[collection];
  if (!suffix) {
    throw new Error(`Colección desconocida: ${collection}`);
  }
  return `${config.dynamodb.tablePrefix}-${suffix}`;
}

function isValidCollection(collection) {
  return !!COLLECTIONS[collection];
}

function getCollections() {
  return Object.keys(COLLECTIONS);
}

module.exports = { tableName, isValidCollection, getCollections, COLLECTIONS };
