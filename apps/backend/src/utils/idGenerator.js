const crypto = require('crypto');

let requisitionCounter = 0;

function generateId() {
  return crypto.randomUUID();
}

function generateRequisitionNumber() {
  requisitionCounter += 1;
  const padded = String(requisitionCounter).padStart(4, '0');
  return `REQ-${padded}`;
}

function resetCounter() {
  requisitionCounter = 0;
}

module.exports = { generateId, generateRequisitionNumber, resetCounter };
