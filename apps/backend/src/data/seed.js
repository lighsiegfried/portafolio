const { users } = require('./fixtures/users');
const { products } = require('./fixtures/products');
const { requisitions } = require('./fixtures/requisitions');
const { requisitionItems } = require('./fixtures/requisitionItems');
const { inventoryMovements } = require('./fixtures/inventoryMovements');
const { leads } = require('./fixtures/leads');
const { leadNotes } = require('./fixtures/leadNotes');
const { auditEvents } = require('./fixtures/auditEvents');

module.exports = {
  users, products, requisitions, requisitionItems,
  inventoryMovements, leads, leadNotes, auditEvents,
  contactMessages: [],
};
