const response = require('../../utils/response');
const repo = require('../../db/mockRepository');

async function list(event) {
  const data = repo.listRequisitions().map((r) => ({
    ...r,
    items: repo.getRequisitionItems(r.id),
  }));
  return response.list(data, { total: data.length });
}

async function create(event) {
  const body = event.validatedBody || event.body || {};
  const data = repo.createRequisition({
    title: body.title,
    description: body.description,
    createdBy: event.user.userId,
  });
  return response.success(data, 201);
}

async function getById(event) {
  const req = repo.findRequisitionById(event.params.id);
  if (!req) {
    return response.error(404, 'NOT_FOUND', 'Requisición no encontrada');
  }
  return response.success({ ...req, items: repo.getRequisitionItems(req.id) });
}

async function approve(event) {
  const req = repo.findRequisitionById(event.params.id);
  if (!req) {
    return response.error(404, 'NOT_FOUND', 'Requisición no encontrada');
  }
  if (req.status !== 'pending') {
    return response.error(400, 'VALIDATION_ERROR', `No se puede aprobar una requisición en estado '${req.status}'`);
  }
  const updated = repo.updateRequisition(req.id, { status: 'approved', approvedBy: event.user.userId });
  return response.success(updated);
}

async function reject(event) {
  const req = repo.findRequisitionById(event.params.id);
  if (!req) {
    return response.error(404, 'NOT_FOUND', 'Requisición no encontrada');
  }
  if (req.status !== 'pending') {
    return response.error(400, 'VALIDATION_ERROR', `No se puede rechazar una requisición en estado '${req.status}'`);
  }
  const body = event.body || {};
  const updated = repo.updateRequisition(req.id, { status: 'rejected', rejectionReason: body.reason || 'Sin especificar' });
  return response.success(updated);
}

async function complete(event) {
  const req = repo.findRequisitionById(event.params.id);
  if (!req) {
    return response.error(404, 'NOT_FOUND', 'Requisición no encontrada');
  }
  if (req.status !== 'approved') {
    return response.error(400, 'VALIDATION_ERROR', 'Solo se pueden completar requisiciones aprobadas');
  }
  const updated = repo.updateRequisition(req.id, {
    status: 'completed',
    completedBy: event.user.userId,
    completedAt: new Date().toISOString(),
  });
  return response.success(updated);
}

module.exports = { list, create, getById, approve, reject, complete };
