const response = require('../../utils/response');
const { getRepository } = require('../../db/repositoryFactory');
const auditService = require('../../services/auditService');
const idempotency = require('../../services/idempotencyService');
const { firstError } = require('../../middleware/validate');
const { ERROR_CODES } = require('../../utils/errorCodes');
const logger = require('../../middleware/logger');
const repo = getRepository();

const CREATE_SCHEMA = {
  title: { required: true, type: 'string', maxLength: 200 },
  description: { required: true, type: 'string', maxLength: 1000 },
  items: { required: true, type: 'array', minLength: 1 },
};

const ITEM_SCHEMA = {
  productName: { required: true, type: 'string', maxLength: 200 },
  unit: { required: true, type: 'string', maxLength: 40 },
  quantity: { required: true, type: 'number', positive: true },
  estimatedCost: { required: true, type: 'number', min: 0 },
};

async function list(event) {
  const qs = event.queryStringParameters || {};
  const limit = qs.limit;
  const nextToken = qs.nextToken || null;

  let result;
  try {
    result = await repo.list('requisitions', { limit, nextToken });
  } catch (err) {
    logger.log('ERROR', 'requisitions', 'list_failed', 'Failed to list requisitions', {
      tableName: 'requisitions',
      limit,
      errorName: err.name,
      errorMessage: err.message,
    });
    return response.error(500, 'INTERNAL_ERROR', 'Error al listar requisiciones');
  }

  const items = result.items || [];
  let enriched;
  try {
    enriched = await Promise.all(items.map(async (r) => {
      let reqItems = [];
      try { reqItems = await repo.getRequisitionItems(r.id); } catch (e) { reqItems = []; }
      return { ...r, items: reqItems };
    }));
  } catch (err) {
    logger.log('WARN', 'requisitions', 'enrich_failed', 'Failed to enrich requisitions with items', {
      errorMessage: err.message,
    });
    enriched = items;
  }

  return response.list(enriched, null, 200, { limit: parseInt(limit, 10) || 50, nextToken: result.nextToken });
}

async function create(event) {
  const body = event.validatedBody || event.body || {};

  const verr = firstError(CREATE_SCHEMA, body);
  if (verr) {
    return response.error(400, ERROR_CODES.VALIDATION_ERROR, verr);
  }

  for (let i = 0; i < body.items.length; i++) {
    const ierr = firstError(ITEM_SCHEMA, body.items[i]);
    if (ierr) {
      return response.error(400, ERROR_CODES.VALIDATION_ERROR, `Ítem ${i + 1}: ${ierr}`);
    }
  }

  return idempotency.run(event, 'requisitions.create', async () => {
    const data = await repo.createRequisition({
      title: body.title,
      description: body.description,
      createdBy: event.user.userId,
    });

    for (const item of body.items) {
      await repo.createRequisitionItem({
        requisitionId: data.id,
        productName: item.productName,
        quantity: item.quantity,
        unit: item.unit,
        estimatedCost: item.estimatedCost,
        observations: item.observations || null,
      });
    }

    await auditService.record('requisition', data.id, 'created', event.user.userId, null, data);

    let reqItems = [];
    try { reqItems = await repo.getRequisitionItems(data.id); } catch (e) { reqItems = []; }
    return response.success({ ...data, items: reqItems }, 201);
  });
}

async function getById(event) {
  const req = await repo.findRequisitionById(event.params.id);
  if (!req) {
    return response.error(404, 'NOT_FOUND', 'Requisición no encontrada');
  }
  let reqItems = [];
  try { reqItems = await repo.getRequisitionItems(req.id); } catch (e) { reqItems = []; }
  return response.success({ ...req, items: reqItems });
}

async function approve(event) {
  return idempotency.run(event, 'requisitions.approve', async () => {
    const req = await repo.findRequisitionById(event.params.id);
    if (!req) {
      return response.error(404, 'NOT_FOUND', 'Requisición no encontrada');
    }
    if (req.status === 'rejected') {
      return response.error(400, ERROR_CODES.INVALID_STATE_TRANSITION, 'No se puede aprobar una requisición rechazada');
    }
    if (req.status === 'completed') {
      return response.error(400, ERROR_CODES.INVALID_STATE_TRANSITION, 'No se puede aprobar una requisición completada');
    }
    if (req.status !== 'pending') {
      return response.error(400, ERROR_CODES.INVALID_STATE_TRANSITION, `No se puede aprobar una requisición en estado '${req.status}'`);
    }
    const previous = { ...req };
    const updated = await repo.updateRequisition(req.id, { status: 'approved', approvedBy: event.user.userId });
    await auditService.record('requisition', req.id, 'approved', event.user.userId, previous, updated);
    return response.success(updated);
  });
}

async function reject(event) {
  return idempotency.run(event, 'requisitions.reject', async () => {
    const req = await repo.findRequisitionById(event.params.id);
    if (!req) {
      return response.error(404, 'NOT_FOUND', 'Requisición no encontrada');
    }
    if (req.status !== 'pending') {
      return response.error(400, ERROR_CODES.INVALID_STATE_TRANSITION, `No se puede rechazar una requisición en estado '${req.status}'`);
    }
    const body = event.body || {};
    if (!body.reason) {
      return response.error(400, 'VALIDATION_ERROR', 'reason es requerido para rechazar una requisición');
    }
    const previous = { ...req };
    const updated = await repo.updateRequisition(req.id, { status: 'rejected', rejectionReason: body.reason });
    await auditService.record('requisition', req.id, 'rejected', event.user.userId, previous, updated);
    return response.success(updated);
  });
}

async function complete(event) {
  return idempotency.run(event, 'requisitions.complete', async () => {
    const req = await repo.findRequisitionById(event.params.id);
    if (!req) {
      return response.error(404, 'NOT_FOUND', 'Requisición no encontrada');
    }
    if (req.status === 'pending') {
      return response.error(400, ERROR_CODES.INVALID_STATE_TRANSITION, 'No se puede completar una requisición pendiente');
    }
    if (req.status === 'rejected') {
      return response.error(400, ERROR_CODES.INVALID_STATE_TRANSITION, 'No se puede completar una requisición rechazada');
    }
    if (req.status !== 'approved') {
      return response.error(400, ERROR_CODES.INVALID_STATE_TRANSITION, `No se puede completar una requisición en estado '${req.status}'`);
    }
    const previous = { ...req };
    const updated = await repo.updateRequisition(req.id, {
      status: 'completed',
      completedBy: event.user.userId,
      completedAt: new Date().toISOString(),
    });
    await auditService.record('requisition', req.id, 'completed', event.user.userId, previous, updated);
    return response.success(updated);
  });
}

module.exports = { list, create, getById, approve, reject, complete };