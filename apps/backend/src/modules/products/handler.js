const response = require('../../utils/response');
const { getRepository } = require('../../db/repositoryFactory');
const auditService = require('../../services/auditService');
const repo = getRepository();

async function list(event) {
  const qs = event.queryStringParameters || {};
  const result = repo.list('products', { limit: qs.limit, offset: qs.nextToken ? parseInt(qs.nextToken.replace('offset_', ''), 10) : 0 });
  return response.list(result.items, { total: repo.listProducts().length }, 200, { limit: parseInt(qs.limit, 10) || 50, nextToken: result.nextToken });
}

async function create(event) {
  const body = event.validatedBody || event.body || {};

  if (!body.sku || !body.name || !body.category || !body.unit) {
    return response.error(400, 'VALIDATION_ERROR', 'sku, name, category y unit son requeridos');
  }
  if (body.price == null || body.price < 0) {
    return response.error(400, 'VALIDATION_ERROR', 'price debe ser mayor o igual a 0');
  }
  if (body.minStock == null || body.minStock < 0) {
    return response.error(400, 'VALIDATION_ERROR', 'minStock debe ser mayor o igual a 0');
  }
  if (body.initialStock != null && body.initialStock < 0) {
    return response.error(400, 'VALIDATION_ERROR', 'initialStock debe ser mayor o igual a 0');
  }

  const existing = repo.findProductBySku(body.sku);
  if (existing) {
    return response.error(409, 'CONFLICT', `El SKU '${body.sku}' ya existe`);
  }

  const data = repo.createProduct({
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
    repo.createInventoryMovement({
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
  const existing = repo.findProductById(event.params.id);
  if (!existing) {
    return response.error(404, 'NOT_FOUND', 'Producto no encontrado');
  }

  const body = event.validatedBody || event.body || {};

  const changes = {};
  const allowedFields = ['name', 'description', 'category', 'unit', 'price', 'minStock', 'active'];
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      changes[field] = body[field];
    }
  }

  if (Object.keys(changes).length === 0) {
    return response.error(400, 'VALIDATION_ERROR', 'No hay campos válidos para actualizar');
  }

  if (changes.price != null && changes.price < 0) {
    return response.error(400, 'VALIDATION_ERROR', 'price debe ser mayor o igual a 0');
  }
  if (changes.minStock != null && changes.minStock < 0) {
    return response.error(400, 'VALIDATION_ERROR', 'minStock debe ser mayor o igual a 0');
  }

  if (body.sku && body.sku !== existing.sku) {
    const skuExists = repo.findProductBySku(body.sku);
    if (skuExists) {
      return response.error(409, 'CONFLICT', `El SKU '${body.sku}' ya existe`);
    }
    changes.sku = body.sku;
  }

  const previous = { ...existing };
  const updated = repo.updateProduct(existing.id, changes);
  await auditService.record('product', existing.id, 'updated', event.user.userId, previous, updated);
  return response.success(updated);
}

async function updateStock(event) {
  const existing = repo.findProductById(event.params.id);
  if (!existing) {
    return response.error(404, 'NOT_FOUND', 'Producto no encontrado');
  }

  const body = event.validatedBody || event.body || {};
  if (!body.type || !['IN', 'OUT'].includes(body.type)) {
    return response.error(400, 'VALIDATION_ERROR', 'type debe ser IN o OUT');
  }
  if (body.quantity == null || body.quantity <= 0) {
    return response.error(400, 'VALIDATION_ERROR', 'quantity debe ser mayor a 0');
  }

  const newStock = body.type === 'IN'
    ? existing.stock + body.quantity
    : existing.stock - body.quantity;

  if (body.type === 'OUT' && newStock < 0) {
    return response.error(400, 'BAD_REQUEST', 'Stock insuficiente para realizar la salida');
  }

  const previous = { ...existing };
  repo.createInventoryMovement({
    productId: existing.id,
    type: body.type,
    quantity: body.quantity,
    stockBefore: existing.stock,
    stockAfter: newStock,
    reference: body.reference || 'Ajuste de stock',
    notes: body.notes || null,
    createdBy: event.user.userId,
  });

  const updated = repo.updateProductStock(existing.id, newStock);
  await auditService.record('product', existing.id, 'stock_updated', event.user.userId, previous, updated);
  return response.success(updated);
}

module.exports = { list, create, update, updateStock };
