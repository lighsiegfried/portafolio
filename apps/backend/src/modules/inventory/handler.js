const config = require('../../config');
const response = require('../../utils/response');
const { getRepository } = require('../../db/repositoryFactory');
const logger = require('../../middleware/logger');
const repo = getRepository();

async function createMovement(event) {
  const body = event.validatedBody || event.body || {};

  if (!body.productId || !body.type || !body.reference) {
    return response.error(400, 'VALIDATION_ERROR', 'productId, type y reference son requeridos');
  }
  if (!['IN', 'OUT'].includes(body.type)) {
    return response.error(400, 'VALIDATION_ERROR', 'type debe ser IN o OUT');
  }
  if (body.quantity == null || body.quantity <= 0) {
    return response.error(400, 'VALIDATION_ERROR', 'quantity debe ser mayor a 0');
  }

  const product = await repo.findProductById(body.productId);
  if (!product) {
    return response.error(404, 'NOT_FOUND', 'Producto no encontrado');
  }

  const newStock = body.type === 'IN'
    ? product.stock + body.quantity
    : product.stock - body.quantity;

  if (body.type === 'OUT' && newStock < 0) {
    return response.error(400, 'BAD_REQUEST', 'Stock insuficiente para realizar la salida');
  }

  const movement = await repo.createInventoryMovement({
    productId: body.productId,
    type: body.type,
    quantity: body.quantity,
    stockBefore: product.stock,
    stockAfter: newStock,
    reference: body.reference,
    notes: body.notes || null,
    createdBy: event.user.userId,
  });

  await repo.updateProductStock(body.productId, newStock);

  return response.success(movement, 201);
}

async function listMovements(event) {
  const qs = event.queryStringParameters || {};
  const limit = qs.limit;
  const nextToken = qs.nextToken || null;

  let result;
  try {
    result = await repo.list('inventoryMovements', { limit, nextToken });
  } catch (err) {
    logger.log('ERROR', 'inventory', 'listMovements_failed', 'Failed to list movements', {
      tableName: 'inventoryMovements',
      limit,
      errorName: err.name,
      errorMessage: err.message,
    });
    return response.error(500, 'INTERNAL_ERROR', 'Error al listar movimientos');
  }

  let items = result.items || [];
  const productId = qs.productId;
  if (productId) {
    items = items.filter((m) => m.productId === productId);
  }

  return response.list(items, null, 200, { limit: parseInt(limit, 10) || 50, nextToken: result.nextToken });
}

async function lowStock(event) {
  const threshold = config.business.defaultLowStockThreshold;
  let result;
  try {
    result = await repo.listLowStockProducts(threshold, { limit: 100 });
  } catch (err) {
    logger.log('ERROR', 'inventory', 'lowStock_failed', 'Failed to list low stock', {
      threshold,
      errorName: err.name,
      errorMessage: err.message,
    });
    return response.error(500, 'INTERNAL_ERROR', 'Error al obtener productos con stock bajo');
  }

  return response.list(result.items || [], { total: (result.items || []).length });
}

module.exports = { createMovement, listMovements, lowStock };