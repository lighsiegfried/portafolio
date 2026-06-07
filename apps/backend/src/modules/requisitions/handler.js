const response = require('../../utils/response');
const { getRepository } = require('../../db/repositoryFactory');
const auditService = require('../../services/auditService');
const repo = getRepository();

async function list(event) {
  const qs = event.queryStringParameters || {};
  const result = repo.list('requisitions', { limit: qs.limit, offset: qs.nextToken ? parseInt(qs.nextToken.replace('offset_', ''), 10) : 0 });
  const data = result.items.map((r) => ({
    ...r,
    items: repo.getRequisitionItems(r.id),
  }));
  return response.list(data, { total: repo.getRequisitionItems ? repo.listRequisitions().length : data.length }, 200, { limit: parseInt(qs.limit, 10) || 50, nextToken: result.nextToken });
}

async function create(event) {
  const body = event.validatedBody || event.body || {};

  if (!body.title || !body.description) {
    return response.error(400, 'VALIDATION_ERROR', 'title y description son requeridos');
  }
  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    return response.error(400, 'VALIDATION_ERROR', 'items es requerido y debe tener al menos un elemento');
  }

  for (let i = 0; i < body.items.length; i++) {
    const item = body.items[i];
    if (!item.productName || !item.unit) {
      return response.error(400, 'VALIDATION_ERROR', `Cada item requiere productName y unit`);
    }
    if (item.quantity == null || item.quantity <= 0) {
      return response.error(400, 'VALIDATION_ERROR', `quantity debe ser mayor a 0`);
    }
    if (item.estimatedCost == null || item.estimatedCost < 0) {
      return response.error(400, 'VALIDATION_ERROR', `estimatedCost debe ser mayor o igual a 0`);
    }
  }

  const data = repo.createRequisition({
    title: body.title,
    description: body.description,
    createdBy: event.user.userId,
  });

  for (const item of body.items) {
    repo.createRequisitionItem({
      requisitionId: data.id,
      productName: item.productName,
      quantity: item.quantity,
      unit: item.unit,
      estimatedCost: item.estimatedCost,
      observations: item.observations || null,
    });
  }

  await auditService.record('requisition', data.id, 'created', event.user.userId, null, data);

  return response.success({ ...data, items: repo.getRequisitionItems(data.id) }, 201);
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
  if (req.status === 'rejected') {
    return response.error(400, 'CONFLICT', 'No se puede aprobar una requisición rechazada');
  }
  if (req.status === 'completed') {
    return response.error(400, 'CONFLICT', 'No se puede aprobar una requisición completada');
  }
  if (req.status !== 'pending') {
    return response.error(400, 'CONFLICT', `No se puede aprobar una requisición en estado '${req.status}'`);
  }
  const previous = { ...req };
  const updated = repo.updateRequisition(req.id, { status: 'approved', approvedBy: event.user.userId });
  await auditService.record('requisition', req.id, 'approved', event.user.userId, previous, updated);
  return response.success(updated);
}

async function reject(event) {
  const req = repo.findRequisitionById(event.params.id);
  if (!req) {
    return response.error(404, 'NOT_FOUND', 'Requisición no encontrada');
  }
  if (req.status !== 'pending') {
    return response.error(400, 'CONFLICT', `No se puede rechazar una requisición en estado '${req.status}'`);
  }
  const body = event.body || {};
  if (!body.reason) {
    return response.error(400, 'VALIDATION_ERROR', 'reason es requerido para rechazar una requisición');
  }
  const previous = { ...req };
  const updated = repo.updateRequisition(req.id, { status: 'rejected', rejectionReason: body.reason });
  await auditService.record('requisition', req.id, 'rejected', event.user.userId, previous, updated);
  return response.success(updated);
}

async function complete(event) {
  const req = repo.findRequisitionById(event.params.id);
  if (!req) {
    return response.error(404, 'NOT_FOUND', 'Requisición no encontrada');
  }
  if (req.status === 'pending') {
    return response.error(400, 'CONFLICT', 'No se puede completar una requisición pendiente');
  }
  if (req.status === 'rejected') {
    return response.error(400, 'CONFLICT', 'No se puede completar una requisición rechazada');
  }
  if (req.status !== 'approved') {
    return response.error(400, 'CONFLICT', `No se puede completar una requisición en estado '${req.status}'`);
  }
  const previous = { ...req };
  const updated = repo.updateRequisition(req.id, {
    status: 'completed',
    completedBy: event.user.userId,
    completedAt: new Date().toISOString(),
  });
  await auditService.record('requisition', req.id, 'completed', event.user.userId, previous, updated);
  return response.success(updated);
}

module.exports = { list, create, getById, approve, reject, complete };
