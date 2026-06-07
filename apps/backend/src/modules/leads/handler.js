const response = require('../../utils/response');
const { getRepository } = require('../../db/repositoryFactory');
const auditService = require('../../services/auditService');
const repo = getRepository();

const VALID_STATUSES = ['new', 'in_contact', 'negotiation', 'won', 'lost'];

async function list(event) {
  const qs = event.queryStringParameters || {};
  const result = repo.list('leads', { limit: qs.limit, offset: qs.nextToken ? parseInt(qs.nextToken.replace('offset_', ''), 10) : 0 });
  const data = result.items.map((l) => ({
    ...l,
    notes: repo.getLeadNotes(l.id),
  }));
  return response.list(data, { total: repo.listLeads().length }, 200, { limit: parseInt(qs.limit, 10) || 50, nextToken: result.nextToken });
}

async function create(event) {
  const body = event.validatedBody || event.body || {};

  if (!body.companyName || !body.contactName || !body.email || !body.phone || !body.source) {
    return response.error(400, 'VALIDATION_ERROR', 'companyName, contactName, email, phone y source son requeridos');
  }

  const data = repo.createLead({
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
  const lead = repo.findLeadById(event.params.id);
  if (!lead) {
    return response.error(404, 'NOT_FOUND', 'Lead no encontrado');
  }
  return response.success({ ...lead, notes: repo.getLeadNotes(lead.id) });
}

async function update(event) {
  const existing = repo.findLeadById(event.params.id);
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
  const updated = repo.updateLead(existing.id, changes);
  await auditService.record('lead', existing.id, 'updated', event.user.userId, previous, updated);
  return response.success({ ...updated, notes: repo.getLeadNotes(updated.id) });
}

async function addNote(event) {
  const existing = repo.findLeadById(event.params.id);
  if (!existing) {
    return response.error(404, 'NOT_FOUND', 'Lead no encontrado');
  }

  const body = event.validatedBody || event.body || {};
  if (!body.content) {
    return response.error(400, 'VALIDATION_ERROR', 'content es requerido');
  }

  const note = repo.addLeadNote({
    leadId: existing.id,
    content: body.content,
    createdBy: event.user.userId,
  });

  await auditService.record('lead', existing.id, 'note_added', event.user.userId, null, note);
  return response.success(note, 201);
}

module.exports = { list, create, getById, update, addNote };
