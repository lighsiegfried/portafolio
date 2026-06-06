const { log } = require('../src/middleware/logger');

let mockDb;
try {
  mockDb = require('../src/data/seed');
} catch (e) {
  mockDb = require('../src/data/mock-db');
}

function printTable(name, data) {
  console.log(`\n  📋 ${name}:`);
  console.log(`     ${'─'.repeat(50)}`);
  data.forEach((item) => {
    const firstField = item.name || item.companyName || item.title || item.contactName || item.sku || item.username || '(sin nombre)';
    const statusField = item.status ? ` [${item.status}]` : '';
    console.log(`     • ${firstField}${statusField}  (${item.id.slice(0, 8)}...)`);
  });
  console.log(`     Total: ${data.length} registros`);
}

console.log(`
  ╔══════════════════════════════════════════╗
  ║     Mini ERP — Seed de Datos Demo        ║
  ╚══════════════════════════════════════════╝
`);

console.log(`  Entorno: ${process.env.NODE_ENV || 'development'}`);
console.log(`  Fecha:   ${new Date().toISOString()}`);

printTable('Usuarios', mockDb.users);
printTable('Productos', mockDb.products);
printTable('Requisiciones', mockDb.requisitions);
printTable('Items de Requisición', mockDb.requisitionItems);
printTable('Movimientos de Inventario', mockDb.inventoryMovements);
printTable('Leads', mockDb.leads);
printTable('Notas de Leads', mockDb.leadNotes);

const total = mockDb.users.length + mockDb.products.length + mockDb.requisitions.length + mockDb.requisitionItems.length + mockDb.inventoryMovements.length + mockDb.leads.length + mockDb.leadNotes.length;
console.log(`\n  ✅ Seed completado. ${total} registros en total.\n`);

log('INFO', 'seed', 'completed', 'Demo data seeded successfully', {
  users: mockDb.users.length,
  products: mockDb.products.length,
  requisitions: mockDb.requisitions.length,
  requisitionItems: mockDb.requisitionItems.length,
  inventoryMovements: mockDb.inventoryMovements.length,
  leads: mockDb.leads.length,
  leadNotes: mockDb.leadNotes.length,
});
