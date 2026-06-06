const { uuid } = require('../utils/idGenerator');
const { log } = require('../middleware/logger');

let useMockDb = false;
let mockAuditStore = null;

function init(mockDbInstance) {
  if (mockDbInstance) {
    useMockDb = true;
    mockAuditStore = mockDbInstance;
  }
}

async function record(entityType, entityId, action, userId, previousState = null, newState = null, submodule = null) {
  const event = {
    id: uuid(),
    entityType,
    entityId,
    action,
    userId,
    previousState: previousState ? JSON.parse(JSON.stringify(previousState)) : null,
    newState: newState ? JSON.parse(JSON.stringify(newState)) : null,
    submodule: submodule || null,
    createdAt: new Date().toISOString(),
  };

  if (useMockDb && mockAuditStore) {
    mockAuditStore.auditEvents.push(event);
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
  if (useMockDb && mockAuditStore) {
    return mockAuditStore.auditEvents
      .filter((e) => e.entityType === entityType && e.entityId === entityId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  return [];
}

async function listAll(filters = {}) {
  if (useMockDb && mockAuditStore) {
    let events = [...mockAuditStore.auditEvents];
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
  return [];
}

module.exports = { init, record, listByEntity, listAll };
