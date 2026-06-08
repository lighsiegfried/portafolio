const { getClient } = require('./client');
const { tableName } = require('./tableNames');
const { generateId, generateRequisitionNumber } = require('../utils/idGenerator');
const bcrypt = require('bcryptjs');
const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

function requireDynamo() {
  if (!getClient) {
    throw new Error('DynamoDB no está disponible en este entorno');
  }
}

async function list(collection, options = {}) {
  requireDynamo();
  const client = getClient();
  const params = {
    TableName: tableName(collection),
  };

  if (options.nextToken) {
    params.ExclusiveStartKey = typeof options.nextToken === 'string'
      ? JSON.parse(Buffer.from(options.nextToken, 'base64').toString('utf-8'))
      : options.nextToken;
  }

  if (options.limit) {
    params.Limit = Math.min(parseInt(options.limit, 10) || 50, 100);
  }

  const result = await client.send(new ScanCommand(params));
  const items = result.Items || [];
  let nextToken = null;
  if (result.LastEvaluatedKey) {
    nextToken = Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64');
  }

  return { items, nextToken };
}

async function findById(collection, id) {
  requireDynamo();
  const client = getClient();
  const params = {
    TableName: tableName(collection),
    Key: { id },
  };
  const result = await client.send(new GetCommand(params));
  return result.Item || null;
}

async function findOneBy(collection, field, value) {
  requireDynamo();
  const client = getClient();
  const params = {
    TableName: tableName(collection),
    FilterExpression: `#field = :value`,
    ExpressionAttributeNames: { '#field': field },
    ExpressionAttributeValues: { ':value': value },
    Limit: 1,
  };
  const result = await client.send(new ScanCommand(params));
  return result.Items && result.Items.length > 0 ? result.Items[0] : null;
}

async function create(collection, payload) {
  requireDynamo();
  const client = getClient();
  const now = new Date().toISOString();
  const item = {
    ...payload,
    id: payload.id || generateId(),
    createdAt: payload.createdAt || now,
    updatedAt: payload.updatedAt || now,
  };
  const params = {
    TableName: tableName(collection),
    Item: item,
  };
  await client.send(new PutCommand(params));
  return item;
}

async function update(collection, id, payload) {
  requireDynamo();
  const existing = await findById(collection, id);
  if (!existing) return null;

  const client = getClient();
  const allowed = { ...payload };
  delete allowed.id;
  delete allowed.createdAt;

  const updateExpressions = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  for (const [key, value] of Object.entries(allowed)) {
    if (value !== undefined) {
      updateExpressions.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    }
  }

  expressionAttributeValues[':updatedAt'] = new Date().toISOString();
  updateExpressions.push('#updatedAt = :updatedAt');
  expressionAttributeNames['#updatedAt'] = 'updatedAt';

  if (updateExpressions.length === 0) {
    return existing;
  }

  const params = {
    TableName: tableName(collection),
    Key: { id },
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  };

  const result = await client.send(new UpdateCommand(params));
  return result.Attributes || existing;
}

async function remove(collection, id) {
  requireDynamo();
  const existing = await findById(collection, id);
  if (!existing) return null;

  const client = getClient();
  const params = {
    TableName: tableName(collection),
    Key: { id },
  };
  await client.send(new DeleteCommand(params));
  return existing;
}

async function queryBy(collection, field, value, options = {}) {
  requireDynamo();
  const client = getClient();
  const params = {
    TableName: tableName(collection),
    FilterExpression: `#field = :value`,
    ExpressionAttributeNames: { '#field': field },
    ExpressionAttributeValues: { ':value': value },
  };

  if (options.nextToken) {
    params.ExclusiveStartKey = typeof options.nextToken === 'string'
      ? JSON.parse(Buffer.from(options.nextToken, 'base64').toString('utf-8'))
      : options.nextToken;
  }

  if (options.limit) {
    params.Limit = Math.min(parseInt(options.limit, 10) || 50, 100);
  }

  const result = await client.send(new ScanCommand(params));
  const items = result.Items || [];
  let nextToken = null;
  if (result.LastEvaluatedKey) {
    nextToken = Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64');
  }

  return { items, nextToken };
}

function findUserByUsername(username) {
  return findOneBy('users', 'username', username);
}

function findUserById(id) {
  return findById('users', id);
}

function verifyPassword(plain, hash) {
  return bcrypt.compareSync(plain, hash);
}

function listRequisitions() {
  return list('requisitions').then((r) => r.items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
}

function findRequisitionById(id) {
  return findById('requisitions', id);
}

function createRequisition(data) {
  const now = new Date().toISOString();
  return create('requisitions', {
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
  });
}

function updateRequisition(id, updates) {
  return update('requisitions', id, updates);
}

function listProducts() {
  return list('products').then((r) => r.items.sort((a, b) => a.name.localeCompare(b.name)));
}

function findProductById(id) {
  return findById('products', id);
}

function findProductBySku(sku) {
  return findOneBy('products', 'sku', sku);
}

function createProduct(data) {
  const now = new Date().toISOString();
  return create('products', {
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
  });
}

function updateProduct(id, data) {
  const allowed = { ...data };
  delete allowed.id;
  delete allowed.createdAt;
  return update('products', id, allowed);
}

function listInventoryMovements() {
  return list('inventoryMovements').then((r) => r.items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
}

function createInventoryMovement(data) {
  const now = new Date().toISOString();
  return create('inventoryMovements', {
    productId: data.productId,
    type: data.type,
    quantity: data.quantity,
    stockBefore: data.stockBefore,
    stockAfter: data.stockAfter,
    reference: data.reference,
    notes: data.notes || null,
    createdBy: data.createdBy,
    createdAt: now,
  });
}

function updateProductStock(id, newStock) {
  return update('products', id, { stock: newStock });
}

function listLowStockProducts(threshold) {
  return list('products').then((r) => r.items.filter((p) => p.stock <= threshold));
}

function listLeads() {
  return list('leads').then((r) => r.items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
}

function findLeadById(id) {
  return findById('leads', id);
}

function createLead(data) {
  const now = new Date().toISOString();
  return create('leads', {
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
  });
}

function updateLead(id, data) {
  const allowed = { ...data };
  delete allowed.id;
  delete allowed.createdAt;
  return update('leads', id, allowed);
}

function addLeadNote(data) {
  return create('leadNotes', {
    leadId: data.leadId,
    content: data.content,
    createdBy: data.createdBy,
    createdAt: new Date().toISOString(),
  });
}

function getRequisitionItems(requisitionId) {
  return queryBy('requisitionItems', 'requisitionId', requisitionId).then((r) => r.items);
}

function createRequisitionItem(data) {
  return create('requisitionItems', {
    requisitionId: data.requisitionId,
    productName: data.productName,
    quantity: data.quantity,
    unit: data.unit,
    estimatedCost: data.estimatedCost,
    observations: data.observations || null,
  });
}

function getLeadNotes(leadId) {
  return queryBy('leadNotes', 'leadId', leadId).then((r) =>
    r.items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  );
}

function getAuditEvents() {
  return list('auditEvents').then((r) => r.items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
}

function getDashboardSummary() {
  throw new Error('getDashboardSummary no está disponible en modo DynamoDB. Usa DATA_SOURCE=mock para desarrollo local.');
}

function getDb() {
  throw new Error('getDb no está disponible en modo DynamoDB. Usa DATA_SOURCE=mock para desarrollo local.');
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
