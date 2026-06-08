const response = require('../../utils/response');
const { getRepository } = require('../../db/repositoryFactory');
const logger = require('../../middleware/logger');

async function summary(event) {
  const repo = getRepository();
  const config = require('../../config');

  let products = [];
  let requisitions = [];
  let leads = [];
  let movements = [];
  let partialFailures = [];

  try {
    const r = await repo.list('products', { limit: 100 });
    products = r.items || [];
  } catch (err) {
    partialFailures.push({ collection: 'products', error: err.message });
    logger.log('ERROR', 'dashboard', 'list_failed', `Failed to list products`, {
      errorName: err.name,
      errorMessage: err.message,
    });
  }

  try {
    const r = await repo.list('requisitions', { limit: 100 });
    requisitions = r.items || [];
  } catch (err) {
    partialFailures.push({ collection: 'requisitions', error: err.message });
    logger.log('ERROR', 'dashboard', 'list_failed', `Failed to list requisitions`, {
      errorName: err.name,
      errorMessage: err.message,
    });
  }

  try {
    const r = await repo.list('leads', { limit: 100 });
    leads = r.items || [];
  } catch (err) {
    partialFailures.push({ collection: 'leads', error: err.message });
    logger.log('ERROR', 'dashboard', 'list_failed', `Failed to list leads`, {
      errorName: err.name,
      errorMessage: err.message,
    });
  }

  try {
    const r = await repo.list('inventoryMovements', { limit: 100 });
    movements = r.items || [];
  } catch (err) {
    partialFailures.push({ collection: 'inventoryMovements', error: err.message });
    logger.log('ERROR', 'dashboard', 'list_failed', `Failed to list inventoryMovements`, {
      errorName: err.name,
      errorMessage: err.message,
    });
  }

  const pendingRequisitions = requisitions.filter((r) => r.status === 'pending').length;
  const approvedRequisitions = requisitions.filter((r) => r.status === 'approved').length;
  const completedRequisitions = requisitions.filter((r) => r.status === 'completed').length;
  const rejectedRequisitions = requisitions.filter((r) => r.status === 'rejected').length;

  const activeLeads = leads.filter((l) => l.status !== 'won' && l.status !== 'lost').length;

  const lowStockProducts = products.filter((p) => {
    const threshold = p.minStock || config.business.defaultLowStockThreshold;
    return p.stock <= threshold;
  }).length;

  const totalInventoryValue = products.reduce((sum, p) => sum + (p.stock || 0) * (p.price || 0), 0);

  const recentMovements = [...movements]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  const recentRequisitions = [...requisitions]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5)
    .map((r) => ({ id: r.id, number: r.number, title: r.title, status: r.status, createdAt: r.createdAt }));

  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5)
    .map((l) => ({ id: l.id, companyName: l.companyName, contactName: l.contactName, status: l.status, createdAt: l.createdAt }));

  return response.success({
    pendingRequisitions,
    approvedRequisitions,
    completedRequisitions,
    rejectedRequisitions,
    lowStockProducts,
    activeLeads,
    recentMovements,
    recentRequisitions,
    recentLeads,
    totalProducts: products.length,
    totalLeads: leads.length,
    totalInventoryValue,
    totalRequisitions: requisitions.length,
  });
}

module.exports = { summary };