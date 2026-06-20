const response = require('../../utils/response');
const { getRepository } = require('../../db/repositoryFactory');
const auditService = require('../../services/auditService');
const { firstError } = require('../../middleware/validate');
const { ERROR_CODES } = require('../../utils/errorCodes');
const logger = require('../../middleware/logger');
const repo = getRepository();

const SKU_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

const CREATE_SCHEMA = {
  sku: { required: true, type: 'string', maxLength: 50, pattern: SKU_PATTERN },
  name: { required: true, type: 'string', maxLength: 120 },
  description: { type: 'string', maxLength: 500 },
  category: { required: true, type: 'string' },
  unit: { required: true, type: 'string' },
  price: { required: true, type: 'number', min: 0 },
  minStock: { required: true, type: 'number', min: 0 },
  initialStock: { type: 'number', min: 0 },
};

const UPDATE_SCHEMA = {
  sku: { type: 'string', maxLength: 50, pattern: SKU_PATTERN },
  name: { type: 'string', maxLength: 120 },
  description: { type: 'string', maxLength: 500 },
  category: { type: 'string' },
  unit: { type: 'string' },
  price: { type: 'number', min: 0 },
  minStock: { type: 'number', min: 0 },
  active: { type: 'boolean' },
};

const STOCK_SCHEMA = {
  type: { required: true, type: 'string', enum: ['IN', 'OUT'] },
  quantity: { required: true, type: 'number', positive: true },
};

async function list(event) {
  const qs = event.queryStringParameters || {};
  const limit = qs.limit;
  const nextToken = qs.nextToken || null;

  let result;
  try {
    result = await repo.list('products', { limit, nextToken });
  } catch (err) {
    logger.log('ERROR', 'products', 'list_failed', 'Failed to list products', {
      tableName: 'products',
      limit,
      errorName: err.name,
      errorMessage: err.message,
    });
    return response.error(500, 'INTERNAL_ERROR', 'Error al listar productos');
  }

  return response.list(result.items || [], null, 200, { limit: parseInt(limit, 10) || 50, nextToken: result.nextToken });
}

async function create(event) {
  const body = event.validatedBody || event.body || {};

  const verr = firstError(CREATE_SCHEMA, body);
  if (verr) {
    return response.error(400, ERROR_CODES.VALIDATION_ERROR, verr);
  }

  let existing;
  try { existing = await repo.findProductBySku(body.sku); } catch (e) { existing = null; }
  if (existing) {
    return response.error(409, ERROR_CODES.CONFLICT, `El SKU '${body.sku}' ya existe`);
  }

  const data = await repo.createProduct({
    sku: body.sku,
    name: body.name,
    description: body.description,
    category: body.category,
    unit: body.unit,
    price: body.price,
    minStock: body.minStock,
    initialStock: body.initialStock,
  });

  if (body.initialStock != null && body.initialStock > 0) {
    await repo.createInventoryMovement({
      productId: data.id,
      type: 'IN',
      quantity: body.initialStock,
      stockBefore: 0,
      stockAfter: body.initialStock,
      reference: 'Stock inicial',
      createdBy: event.user.userId,
    });
  }

  await auditService.record('product', data.id, 'created', event.user.userId, null, data);
  return response.success(data, 201);
}

async function update(event) {
  const existing = await repo.findProductById(event.params.id);
  if (!existing) {
    return response.error(404, 'NOT_FOUND', 'Producto no encontrado');
  }

  const body = event.validatedBody || event.body || {};

  const verr = firstError(UPDATE_SCHEMA, body);
  if (verr) {
    return response.error(400, ERROR_CODES.VALIDATION_ERROR, verr);
  }

  const changes = {};
  const allowedFields = ['name', 'description', 'category', 'unit', 'price', 'minStock', 'active'];
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      changes[field] = body[field];
    }
  }

  if (Object.keys(changes).length === 0 && !body.sku) {
    return response.error(400, ERROR_CODES.VALIDATION_ERROR, 'No hay campos válidos para actualizar');
  }

  if (body.sku && body.sku !== existing.sku) {
    let skuExists;
    try { skuExists = await repo.findProductBySku(body.sku); } catch (e) { skuExists = null; }
    if (skuExists) {
      return response.error(409, ERROR_CODES.CONFLICT, `El SKU '${body.sku}' ya existe`);
    }
    changes.sku = body.sku;
  }

  const previous = { ...existing };
  const updated = await repo.updateProduct(existing.id, changes);
  await auditService.record('product', existing.id, 'updated', event.user.userId, previous, updated);
  return response.success(updated);
}

async function updateStock(event) {
  const existing = await repo.findProductById(event.params.id);
  if (!existing) {
    return response.error(404, 'NOT_FOUND', 'Producto no encontrado');
  }

  const body = event.validatedBody || event.body || {};
  const verr = firstError(STOCK_SCHEMA, body);
  if (verr) {
    return response.error(400, ERROR_CODES.VALIDATION_ERROR, verr);
  }

  const previous = { ...existing };

  // Atomic, conditional stock change (same guard as inventory movements): the
  // OUT is rejected when stock is insufficient, with no read-modify-write race.
  const delta = body.type === 'IN' ? body.quantity : -body.quantity;
  const updated = await repo.adjustProductStock(existing.id, delta);
  if (!updated) {
    return response.error(400, ERROR_CODES.INSUFFICIENT_STOCK, 'Stock insuficiente para realizar la salida');
  }

  const stockAfter = updated.stock;
  const stockBefore = stockAfter - delta;

  await repo.createInventoryMovement({
    productId: existing.id,
    type: body.type,
    quantity: body.quantity,
    stockBefore,
    stockAfter,
    reference: body.reference || 'Ajuste de stock',
    notes: body.notes || null,
    createdBy: event.user.userId,
  });

  await auditService.record('product', existing.id, 'stock_updated', event.user.userId, previous, updated);
  return response.success(updated);
}

module.exports = { list, create, update, updateStock };