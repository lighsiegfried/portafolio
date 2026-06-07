const response = require('../../utils/response');
const { getRepository } = require('../../db/repositoryFactory');
const repo = getRepository();

async function summary(event) {
  const db = repo.getDb();

  const totalProducts = db.products.length;
  const totalRequisitions = db.requisitions.length;
  const pendingRequisitions = db.requisitions.filter((r) => r.status === 'pending').length;
  const approvedRequisitions = db.requisitions.filter((r) => r.status === 'approved').length;
  const completedRequisitions = db.requisitions.filter((r) => r.status === 'completed').length;
  const rejectedRequisitions = db.requisitions.filter((r) => r.status === 'rejected').length;

  const totalLeads = db.leads.length;
  const activeLeads = db.leads.filter((l) => l.status !== 'won' && l.status !== 'lost').length;

  const lowStockProducts = db.products.filter((p) => p.stock <= p.minStock).length;
  const totalInventoryValue = db.products.reduce((sum, p) => sum + p.stock * p.price, 0);

  const recentMovements = [...db.inventoryMovements]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const recentRequisitions = [...db.requisitions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((r) => ({ id: r.id, number: r.number, title: r.title, status: r.status, createdAt: r.createdAt }));

  const recentLeads = [...db.leads]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
    totalProducts,
    totalLeads,
    totalInventoryValue,
    totalRequisitions,
  });
}

module.exports = { summary };
