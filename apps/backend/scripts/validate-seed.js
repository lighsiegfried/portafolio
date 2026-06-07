const { validateSeedData } = require('../src/data/validateSeed');

function getData() {
  try {
    return require('../src/data/mock-db');
  } catch (e) {
    try {
      return require('../src/data/seed');
    } catch (e2) {
      console.error('No se pudo cargar los datos seed.');
      process.exit(1);
    }
  }
}

const data = getData();

console.log(`
  ╔══════════════════════════════════════════╗
  ║   Mini ERP — Validación de Datos Seed   ║
  ╚══════════════════════════════════════════╝
`);

const counts = {
  Usuarios: data.users?.length || 0,
  Productos: data.products?.length || 0,
  Requisiciones: data.requisitions?.length || 0,
  'Items de Requisición': data.requisitionItems?.length || 0,
  'Movimientos de Inventario': data.inventoryMovements?.length || 0,
  Leads: data.leads?.length || 0,
  'Notas de Leads': data.leadNotes?.length || 0,
  'Eventos de Auditoría': data.auditEvents?.length || 0,
};

console.log('  Resumen de datos:\n');
Object.entries(counts).forEach(([name, count]) => {
  console.log(`    ${name.padEnd(30)} ${count}`);
});

const total = Object.values(counts).reduce((a, b) => a + b, 0);
console.log(`    ${'─'.repeat(40)}`);
console.log(`    Total registros               ${total}\n`);

console.log('  Validando consistencia...\n');
const errors = validateSeedData(data);

if (errors.length === 0) {
  console.log('  ✅ Todos los datos son consistentes. No se encontraron errores.\n');
  process.exit(0);
} else {
  console.log(`  ❌ Se encontraron ${errors.length} error(es):\n`);
  errors.forEach((err, i) => {
    const location = err.entity ? `[${err.entity}#${err.index}]` : '';
    const fieldInfo = err.field ? `.${err.field}` : '';
    console.log(`    ${i + 1}. ${err.type} ${location}${fieldInfo}`);
    console.log(`       ${err.message || err.value || '(sin detalle)'}`);
    console.log();
  });
  process.exit(1);
}
