const response = require('../../utils/response');
const repo = require('../../db/mockRepository');

async function list(event) {
  const data = repo.listLeads().map((l) => ({
    ...l,
    notes: repo.getLeadNotes(l.id),
  }));
  return response.list(data, { total: data.length });
}

async function create(event) {
  return response.success({ message: 'Leads create — pendiente Fase 2' }, 201);
}

async function getById(event) {
  const lead = repo.findLeadById(event.params.id);
  if (!lead) {
    return response.error(404, 'NOT_FOUND', 'Lead no encontrado');
  }
  return response.success({ ...lead, notes: repo.getLeadNotes(lead.id) });
}

async function update(event) {
  return response.success({ message: 'Leads update — pendiente Fase 2' });
}

async function addNote(event) {
  return response.success({ message: 'Leads addNote — pendiente Fase 2' }, 201);
}

module.exports = { list, create, getById, update, addNote };
