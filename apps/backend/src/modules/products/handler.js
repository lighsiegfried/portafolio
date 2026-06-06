const response = require('../../utils/response');
const repo = require('../../db/mockRepository');

async function list(event) {
  const data = repo.listProducts();
  return response.list(data, { total: data.length });
}

async function create(event) {
  return response.success({ message: 'Products create — pendiente Fase 2' }, 201);
}

async function update(event) {
  return response.success({ message: 'Products update — pendiente Fase 2' });
}

async function updateStock(event) {
  return response.success({ message: 'Products updateStock — pendiente Fase 2' });
}

module.exports = { list, create, update, updateStock };
