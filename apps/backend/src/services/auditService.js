const { generateId } = require('../utils/idGenerator');
const { log } = require('../middleware/logger');

let repository = null;

function init(repoInstance) {
  repository = repoInstance;
}

async function record(entityType, entityId, action, userId, previousState = null, newState = null, submodule = null) {
  const event = {
    id: generateId(),
    entityType,
    entityId,
    action,
    userId,
    previousState: previousState ? JSON.parse(JSON.stringify(previousState)) : null,
    newState: newState ? JSON.parse(JSON.stringify(newState)) : null,
    submodule: submodule || null,
    createdAt: new Date().toISOString(),
  };

  if (repository) {
    await repository.create('auditEvents', event);
  }

  log('INFO', entityType, action, `${action} on ${entityType} ${entityId}`, {
    entityType,
    entityId,
    action,
    userId,
    eventId: event.id,
  });

  return event;
}

async function listByEntity(entityType, entityId) {
  if (!repository) return [];
  const result = await repository.queryBy('auditEvents', 'entityId', entityId);
  let events = result.items.filter((e) => e.entityType === entityType);
  return events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function listAll(filters = {}) {
  if (!repository) return [];
  const result = await repository.list('auditEvents');
  let events = result.items;
  if (filters.entityType) {
    events = events.filter((e) => e.entityType === filters.entityType);
  }
  if (filters.entityId) {
    events = events.filter((e) => e.entityId === filters.entityId);
  }
  if (filters.action) {
    events = events.filter((e) => e.action === filters.action);
  }
  return events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

module.exports = { init, record, listByEntity, listAll };
