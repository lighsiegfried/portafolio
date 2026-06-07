const config = require('../../config');
const response = require('../../utils/response');
const { getRepository } = require('../../db/repositoryFactory');
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

  const product = repo.findProductById(body.productId);
  if (!product) {
    return response.error(404, 'NOT_FOUND', 'Producto no encontrado');
  }

  const newStock = body.type === 'IN'
    ? product.stock + body.quantity
    : product.stock - body.quantity;

  if (body.type === 'OUT' && newStock < 0) {
    return response.error(400, 'BAD_REQUEST', 'Stock insuficiente para realizar la salida');
  }

  const movement = repo.createInventoryMovement({
    productId: body.productId,
    type: body.type,
    quantity: body.quantity,
    stockBefore: product.stock,
    stockAfter: newStock,
    reference: body.reference,
    notes: body.notes || null,
    createdBy: event.user.userId,
  });

  repo.updateProductStock(body.productId, newStock);

  return response.success(movement, 201);
}

async function listMovements(event) {
  const qs = event.queryStringParameters || {};
  let data = repo.listInventoryMovements();

  const productId = qs.productId;
  if (productId) {
    data = data.filter((m) => m.productId === productId);
  }

  const totalBeforePagination = data.length;
  const limit = Math.min(parseInt(qs.limit, 10) || 50, 100);
  const offset = parseInt(qs.nextToken ? qs.nextToken.replace('offset_', '') : '0', 10);
  const paginated = data.slice(offset, offset + limit);
  let nextToken = null;
  if (offset + limit < totalBeforePagination) {
    nextToken = `offset_${offset + limit}`;
  }

  return response.list(paginated, { total: totalBeforePagination }, 200, { limit, nextToken });
}

async function lowStock(event) {
  const threshold = config.business.defaultLowStockThreshold;
  const data = repo.listLowStockProducts(threshold);
  return response.list(data, { total: data.length });
}

module.exports = { createMovement, listMovements, lowStock };
