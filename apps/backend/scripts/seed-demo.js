const { validateSeedData } = require('../src/data/validateSeed');
const { log } = require('../src/middleware/logger');

const ALLOW_DYNAMODB_SEED = process.env.ALLOW_DYNAMODB_SEED === 'true';
const RESET_EXISTING_DATA = process.env.RESET_EXISTING_DATA === 'true';

let seedData;
try {
  seedData = require('../src/data/seed');
} catch (e) {
  seedData = require('../src/data/mock-db');
}

function printTable(name, data) {
  console.log(`\n  ${name}:`);
  console.log(`     ${'\u2500'.repeat(50)}`);
  data.forEach((item) => {
    const firstField = item.name || item.companyName || item.title || item.contactName || item.sku || item.username || '(sin nombre)';
    const statusField = item.status ? ` [${item.status}]` : '';
    console.log(`     \u2022 ${firstField}${statusField}  (${item.id.slice(0, 8)}...)`);
  });
  console.log(`     Total: ${data.length} registros`);
}

function printRequisitionItems(data) {
  console.log(`\n  Items de Requisición:`);
  console.log(`     ${'\u2500'.repeat(50)}`);
  data.forEach((item) => {
    const name = item.productName || '(sin nombre)';
    const reqId = item.requisitionId ? item.requisitionId.slice(0, 8) : '?';
    const qty = item.quantity || '?';
    console.log(`     \u2022 ${name}  (req: ${reqId}, qty: ${qty})`);
  });
  console.log(`     Total: ${data.length} registros`);
}

function printMovements(data) {
  console.log(`\n  Movimientos de Inventario:`);
  console.log(`     ${'\u2500'.repeat(50)}`);
  data.forEach((item) => {
    const prodId = item.productId ? item.productId.slice(0, 8) : '?';
    const type = item.type || '?';
    const qty = item.quantity || '?';
    console.log(`     \u2022 productId: ${prodId}, ${type}, qty: ${qty}`);
  });
  console.log(`     Total: ${data.length} registros`);
}

function printLeadNotes(data) {
  console.log(`\n  Notas de Leads:`);
  console.log(`     ${'\u2500'.repeat(50)}`);
  data.forEach((item) => {
    const leadId = item.leadId ? item.leadId.slice(0, 8) : '?';
    const content = (item.content || '').substring(0, 60);
    console.log(`     \u2022 leadId: ${leadId} — "${content}"`);
  });
  console.log(`     Total: ${data.length} registros`);
}

async function seedToDynamo(data) {
  const { getRepository } = require('../src/db/repositoryFactory');
  const repo = getRepository();

  const entities = [
    { key: 'users', items: data.users },
    { key: 'products', items: data.products },
    { key: 'requisitions', items: data.requisitions },
    { key: 'requisitionItems', items: data.requisitionItems },
    { key: 'inventoryMovements', items: data.inventoryMovements },
    { key: 'leads', items: data.leads },
    { key: 'leadNotes', items: data.leadNotes },
    { key: 'auditEvents', items: data.auditEvents },
  ];

  let total = 0;
  for (const entity of entities) {
    console.log(`  Escribiendo ${entity.items.length} registros en ${entity.key}...`);
    for (const item of entity.items) {
      await repo.create(entity.key, item);
      total++;
    }
    console.log(`  ✅ ${entity.key}: ${entity.items.length} registros escritos.`);
  }
  return total;
}

console.log(`
  \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
  \u2551     Mini ERP \u2014 Seed de Datos Demo        \u2551
  \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d
`);

console.log(`  Entorno:       ${process.env.NODE_ENV || 'development'}`);
console.log(`  DATA_SOURCE:   ${process.env.DATA_SOURCE || 'mock'}`);
console.log(`  DYNAMODB_TABLE_PREFIX: ${process.env.DYNAMODB_TABLE_PREFIX || '(no configurado)'}`);
console.log(`  ALLOW_DYNAMODB_SEED:   ${ALLOW_DYNAMODB_SEED}`);
console.log(`  RESET_EXISTING_DATA:   ${RESET_EXISTING_DATA}`);
console.log(`  Fecha:         ${new Date().toISOString()}\n`);

if (RESET_EXISTING_DATA) {
  console.log('  \u26A0\uFE0F  \u26A0\uFE0F  \u26A0\uFE0F  ADVERTENCIA: reset_existing_data = true  \u26A0\uFE0F  \u26A0\uFE0F  \u26A0\uFE0F');
  console.log('  Se eliminarán los registros existentes antes de insertar datos semilla.\n');
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

console.log('  \u2705 Datos seed válidos.\n');

printTable('Usuarios', seedData.users);
printTable('Productos', seedData.products);
printTable('Requisiciones', seedData.requisitions);
printRequisitionItems(seedData.requisitionItems);
printMovements(seedData.inventoryMovements);
printTable('Leads', seedData.leads);
printLeadNotes(seedData.leadNotes);

const rawTotal = seedData.users.length + seedData.products.length + seedData.requisitions.length + seedData.requisitionItems.length + seedData.inventoryMovements.length + seedData.leads.length + seedData.leadNotes.length;

if (process.env.DATA_SOURCE === 'dynamodb' && ALLOW_DYNAMODB_SEED) {
  (async () => {
    console.log('\n  \u2705  Escribiendo datos semilla en DynamoDB...\n');
    try {
      const written = await seedToDynamo(seedData);
      console.log(`\n  \u2705 Seed completado. ${written} registros escritos en DynamoDB.\n`);
      log('INFO', 'seed', 'completed', 'Demo data seeded to DynamoDB successfully', {
        users: seedData.users.length,
        products: seedData.products.length,
        requisitions: seedData.requisitions.length,
        requisitionItems: seedData.requisitionItems.length,
        inventoryMovements: seedData.inventoryMovements.length,
        leads: seedData.leads.length,
        leadNotes: seedData.leadNotes.length,
        resetExistingData: RESET_EXISTING_DATA,
      });
    } catch (err) {
      console.error(`\n  \u274C  Error escribiendo en DynamoDB: ${err.message}\n`);
      process.exit(1);
    }
  })();
} else {
  console.log(`\n  \u2705 Seed simulado. ${rawTotal} registros en total (solo lectura).\n`);
  if (process.env.DATA_SOURCE === 'dynamodb' && !ALLOW_DYNAMODB_SEED) {
    console.log(`
  \u26A0\uFE0F  DATOS SEMILLA NO ESCRITOS EN DYNAMODB.
  Para permitir la escritura en DynamoDB, establezca:
    DATA_SOURCE=dynamodb ALLOW_DYNAMODB_SEED=true npm run seed
`);
  }

  log('INFO', 'seed', 'completed', 'Demo data validated successfully (dry-run)', {
    users: seedData.users.length,
    products: seedData.products.length,
    requisitions: seedData.requisitions.length,
    requisitionItems: seedData.requisitionItems.length,
    inventoryMovements: seedData.inventoryMovements.length,
    leads: seedData.leads.length,
    leadNotes: seedData.leadNotes.length,
    resetExistingData: RESET_EXISTING_DATA,
  });
}
