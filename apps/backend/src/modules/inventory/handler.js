const config = require('../../config');
const response = require('../../utils/response');
const repo = require('../../db/mockRepository');

async function createMovement(event) {
  return response.success({ message: 'Inventory createMovement — pendiente Fase 2' }, 201);
}

async function listMovements(event) {
  const data = repo.listInventoryMovements();
  return response.list(data, { total: data.length });
}

async function lowStock(event) {
  const threshold = config.business.defaultLowStockThreshold;
  const data = repo.listLowStockProducts(threshold);
  return response.list(data, { total: data.length });
}

module.exports = { createMovement, listMovements, lowStock };
