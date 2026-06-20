const config = require('../../config');
const response = require('../../utils/response');
const { getRepository } = require('../../db/repositoryFactory');
const auditService = require('../../services/auditService');
const idempotency = require('../../services/idempotencyService');
const { firstError } = require('../../middleware/validate');
const { ERROR_CODES } = require('../../utils/errorCodes');
const logger = require('../../middleware/logger');
const repo = getRepository();

const MOVEMENT_SCHEMA = {
  productId: { required: true, type: 'string' },
  type: { required: true, type: 'string', enum: ['IN', 'OUT'] },
  quantity: { required: true, type: 'number', positive: true },
  reference: { required: true, type: 'string', maxLength: 200 },
  notes: { type: 'string', maxLength: 500 },
};

async function createMovement(event) {
  const body = event.validatedBody || event.body || {};

  const verr = firstError(MOVEMENT_SCHEMA, body);
  if (verr) {
    return response.error(400, ERROR_CODES.VALIDATION_ERROR, verr);
  }

  // Wrap the side effects (stock adjust + movement) so a retried request with
  // the same Idempotency-Key does not apply the stock change twice.
  return idempotency.run(event, 'inventory.createMovement', async () => {
    const product = await repo.findProductById(body.productId);
    if (!product) {
      return response.error(404, 'NOT_FOUND', 'Producto no encontrado');
    }

    // Apply the stock change atomically first: the conditional update rejects the
    // OUT when stock is insufficient, preventing negative stock and lost updates
    // from concurrent movements. Only record the movement if the change succeeded.
    const delta = body.type === 'IN' ? body.quantity : -body.quantity;
    const updatedProduct = await repo.adjustProductStock(body.productId, delta);
    if (!updatedProduct) {
      return response.error(400, ERROR_CODES.INSUFFICIENT_STOCK, 'Stock insuficiente para realizar la salida');
    }

    const stockAfter = updatedProduct.stock;
    const stockBefore = stockAfter - delta;

    const movement = await repo.createInventoryMovement({
      productId: body.productId,
      type: body.type,
      quantity: body.quantity,
      stockBefore,
      stockAfter,
      reference: body.reference,
      notes: body.notes || null,
      createdBy: event.user.userId,
    });

    await auditService.record('inventory_movement', movement.id, 'created', event.user.userId, null, movement);

    return response.success(movement, 201);
  });
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