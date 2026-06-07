const response = require('../../utils/response');
const { toCSV } = require('../../utils/csvHelper');
const { getRepository } = require('../../db/repositoryFactory');
const repo = getRepository();

async function exportRequisitions(event) {
  const data = repo.listRequisitions();
  const fields = ['id', 'number', 'title', 'status', 'createdAt', 'updatedAt'];
  const csv = toCSV(data, fields);
  return response.csv(csv, 'requisitions.csv');
}

async function exportInventory(event) {
  const data = repo.listProducts();
  const fields = ['id', 'sku', 'name', 'category', 'stock', 'minStock', 'price'];
  const csv = toCSV(data, fields);
  return response.csv(csv, 'inventory.csv');
}

async function exportLeads(event) {
  const data = repo.listLeads();
  const fields = ['id', 'companyName', 'contactName', 'email', 'status', 'source'];
  const csv = toCSV(data, fields);
  return response.csv(csv, 'leads.csv');
}

module.exports = { exportRequisitions, exportInventory, exportLeads };
