const response = require('../../utils/response');
const { toCSV } = require('../../utils/csvHelper');
const { getRepository } = require('../../db/repositoryFactory');
const logger = require('../../middleware/logger');
const repo = getRepository();

async function exportRequisitions(event) {
  let items;
  try {
    const result = await repo.list('requisitions', { limit: 1000 });
    items = result.items || [];
  } catch (err) {
    logger.log('ERROR', 'reports', 'exportRequisitions_failed', 'Failed to export requisitions', {
      errorName: err.name,
      errorMessage: err.message,
    });
    return response.error(500, 'INTERNAL_ERROR', 'Error al exportar requisiciones');
  }
  const fields = ['id', 'number', 'title', 'status', 'createdAt', 'updatedAt'];
  const csv = toCSV(items, fields);
  return response.csv(csv, 'requisitions.csv');
}

async function exportInventory(event) {
  let items;
  try {
    const result = await repo.list('products', { limit: 1000 });
    items = result.items || [];
  } catch (err) {
    logger.log('ERROR', 'reports', 'exportInventory_failed', 'Failed to export inventory', {
      errorName: err.name,
      errorMessage: err.message,
    });
    return response.error(500, 'INTERNAL_ERROR', 'Error al exportar inventario');
  }
  const fields = ['id', 'sku', 'name', 'category', 'stock', 'minStock', 'price'];
  const csv = toCSV(items, fields);
  return response.csv(csv, 'inventory.csv');
}

async function exportLeads(event) {
  let items;
  try {
    const result = await repo.list('leads', { limit: 1000 });
    items = result.items || [];
  } catch (err) {
    logger.log('ERROR', 'reports', 'exportLeads_failed', 'Failed to export leads', {
      errorName: err.name,
      errorMessage: err.message,
    });
    return response.error(500, 'INTERNAL_ERROR', 'Error al exportar leads');
  }
  const fields = ['id', 'companyName', 'contactName', 'email', 'status', 'source'];
  const csv = toCSV(items, fields);
  return response.csv(csv, 'leads.csv');
}

module.exports = { exportRequisitions, exportInventory, exportLeads };