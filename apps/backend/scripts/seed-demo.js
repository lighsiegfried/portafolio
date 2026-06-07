const { validateSeedData } = require('../src/data/validateSeed');
const { log } = require('../src/middleware/logger');

const ALLOW_DYNAMODB_SEED = process.env.ALLOW_DYNAMODB_SEED === 'true';

let seedData;
try {
  seedData = require('../src/data/seed');
} catch (e) {
  seedData = require('../src/data/mock-db');
}

function printTable(name, data) {
  console.log(`\n  \u{1F4CB} ${name}:`);
  console.log(`     ${'\u2500'.repeat(50)}`);
  data.forEach((item) => {
    const firstField = item.name || item.companyName || item.title || item.contactName || item.sku || item.username || '(sin nombre)';
    const statusField = item.status ? ` [${item.status}]` : '';
    console.log(`     \u2022 ${firstField}${statusField}  (${item.id.slice(0, 8)}...)`);
  });
  console.log(`     Total: ${data.length} registros`);
}

console.log(`
  \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
  \u2551     Mini ERP \u2014 Seed de Datos Demo        \u2551
  \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d
`);

console.log(`  Entorno: ${process.env.NODE_ENV || 'development'}`);
console.log(`  Fecha:   ${new Date().toISOString()}`);

if (process.env.DATA_SOURCE === 'dynamodb' && !ALLOW_DYNAMODB_SEED) {
  console.log(`
  \u26A0\uFE0F  DATOS SEMILLA NO ESCRITOS EN DYNAMODB.
  Para permitir la escritura en DynamoDB, establezca:
    DATA_SOURCE=dynamodb ALLOW_DYNAMODB_SEED=true npm run seed
`);
} else if (process.env.DATA_SOURCE === 'dynamodb' && ALLOW_DYNAMODB_SEED) {
  console.log('\n  \u2705  Escribiendo datos semilla en DynamoDB...\n');
}

const errors = validateSeedData(seedData);
if (errors.length > 0) {
  console.log('\n  \u274C  ERRORES DE VALIDACIÓN ENCONTRADOS:\n');
  errors.forEach((err, i) => {
    const location = err.entity ? `[${err.entity}#${err.index}]` : '';
    const fieldInfo = err.field ? `.${err.field}` : '';
    console.log(`    ${i + 1}. ${err.type} ${location}${fieldInfo}`);
    console.log(`       ${err.message || err.value || '(sin detalle)'}`);
  });
  console.log('\n  Abortando seed por errores de validación.\n');
  process.exit(1);
}

printTable('Usuarios', seedData.users);
printTable('Productos', seedData.products);
printTable('Requisiciones', seedData.requisitions);
printTable('Items de Requisición', seedData.requisitionItems);
printTable('Movimientos de Inventario', seedData.inventoryMovements);
printTable('Leads', seedData.leads);
printTable('Notas de Leads', seedData.leadNotes);

const total = seedData.users.length + seedData.products.length + seedData.requisitions.length + seedData.requisitionItems.length + seedData.inventoryMovements.length + seedData.leads.length + seedData.leadNotes.length;
console.log(`\n  \u2705 Seed completado. ${total} registros en total.\n`);

log('INFO', 'seed', 'completed', 'Demo data seeded successfully', {
  users: seedData.users.length,
  products: seedData.products.length,
  requisitions: seedData.requisitions.length,
  requisitionItems: seedData.requisitionItems.length,
  inventoryMovements: seedData.inventoryMovements.length,
  leads: seedData.leads.length,
  leadNotes: seedData.leadNotes.length,
});
