const response = require('../../utils/response');
const { getRepository } = require('../../db/repositoryFactory');
const auditService = require('../../services/auditService');
const logger = require('../../middleware/logger');
const repo = getRepository();

const VALID_STATUSES = ['new', 'in_contact', 'negotiation', 'won', 'lost'];

async function list(event) {
  const qs = event.queryStringParameters || {};
  const limit = qs.limit;
  const nextToken = qs.nextToken || null;

  let result;
  try {
    result = await repo.list('leads', { limit, nextToken });
  } catch (err) {
    logger.log('ERROR', 'leads', 'list_failed', 'Failed to list leads', {
      tableName: 'leads',
      limit,
      errorName: err.name,
      errorMessage: err.message,
    });
    return response.error(500, 'INTERNAL_ERROR', 'Error al listar leads');
  }

  const items = result.items || [];
  let enriched;
  try {
    enriched = await Promise.all(items.map(async (l) => {
      let notes = [];
      try { notes = await repo.getLeadNotes(l.id); } catch (e) { notes = []; }
      return { ...l, notes };
    }));
  } catch (err) {
    logger.log('WARN', 'leads', 'enrich_failed', 'Failed to enrich leads with notes', {
      errorMessage: err.message,
    });
    enriched = items;
  }

  return response.list(enriched, null, 200, { limit: parseInt(limit, 10) || 50, nextToken: result.nextToken });
}

async function create(event) {
  const body = event.validatedBody || event.body || {};

  if (!body.companyName || !body.contactName || !body.email || !body.phone || !body.source) {
    return response.error(400, 'VALIDATION_ERROR', 'companyName, contactName, email, phone y source son requeridos');
  }

  const data = await repo.createLead({
    companyName: body.companyName,
    contactName: body.contactName,
    email: body.email,
    phone: body.phone,
    source: body.source,
    notes: body.notes || null,
    nextFollowUp: body.nextFollowUp || null,
    assignedTo: event.user.userId,
  });

  await auditService.record('lead', data.id, 'created', event.user.userId, null, data);
  return response.success({ ...data, notes: [] }, 201);
}

async function getById(event) {
  const lead = await repo.findLeadById(event.params.id);
  if (!lead) {
    return response.error(404, 'NOT_FOUND', 'Lead no encontrado');
  }
  let notes = [];
  try { notes = await repo.getLeadNotes(lead.id); } catch (e) { notes = []; }
  return response.success({ ...lead, notes });
}

async function update(event) {
  const existing = await repo.findLeadById(event.params.id);
  if (!existing) {
    return response.error(404, 'NOT_FOUND', 'Lead no encontrado');
  }

  const body = event.validatedBody || event.body || {};

  if (body.status && !VALID_STATUSES.includes(body.status)) {
    return response.error(400, 'VALIDATION_ERROR', `Status inválido. Debe ser uno de: ${VALID_STATUSES.join(', ')}`);
  }

  const changes = {};
  const allowedFields = ['companyName', 'contactName', 'email', 'phone', 'source', 'status', 'nextFollowUp', 'notes'];
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      changes[field] = body[field];
    }
  }

  if (Object.keys(changes).length === 0) {
    return response.error(400, 'VALIDATION_ERROR', 'No hay campos válidos para actualizar');
  }

  const previous = { ...existing };
  const updated = await repo.updateLead(existing.id, changes);
  await auditService.record('lead', existing.id, 'updated', event.user.userId, previous, updated);
  let notes = [];
  try { notes = await repo.getLeadNotes(updated.id); } catch (e) { notes = []; }
  return response.success({ ...updated, notes });
}

async function addNote(event) {
  const existing = await repo.findLeadById(event.params.id);
  if (!existing) {
    return response.error(404, 'NOT_FOUND', 'Lead no encontrado');
  }

  const body = event.validatedBody || event.body || {};
  if (!body.content) {
    return response.error(400, 'VALIDATION_ERROR', 'content es requerido');
  }

  const note = await repo.addLeadNote({
    leadId: existing.id,
    content: body.content,
    createdBy: event.user.userId,
  });

  await auditService.record('lead', existing.id, 'note_added', event.user.userId, null, note);
  return response.success(note, 201);
}

module.exports = { list, create, getById, update, addNote };