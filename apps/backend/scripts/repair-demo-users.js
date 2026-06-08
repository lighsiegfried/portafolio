const bcrypt = require('bcryptjs');

const ALLOW_USER_REPAIR = process.env.ALLOW_USER_REPAIR === 'true';
const DATA_SOURCE = process.env.DATA_SOURCE || 'mock';

const DEMO_USERS = [
  { username: 'wilson',    demoPassword: 'admin123' },
  { username: 'compras1',  demoPassword: 'compras123' },
  { username: 'bodega1',   demoPassword: 'bodega123' },
  { username: 'gerencia1', demoPassword: 'gerencia123' },
];

console.log(`
  \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
  \u2551     Reparaci\u00f3n de Usuarios Demo              \u2551
  \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d
`);
console.log(`  DATA_SOURCE:       ${DATA_SOURCE}`);
console.log(`  ALLOW_USER_REPAIR: ${ALLOW_USER_REPAIR}`);
console.log(`  Tabla:            ${process.env.DYNAMODB_TABLE_PREFIX || '(no configurado)'}-users\n`);

if (!ALLOW_USER_REPAIR) {
  console.log(`  \u26A0\uFE0F  Para ejecutar la reparaci\u00f3n, establezca ALLOW_USER_REPAIR=true`);
  console.log(`  Ejecutando en modo dry-run (solo verificaci\u00f3n de hashes).\n`);
}

(async () => {
  let updatedCount = 0;
  let verifiedCount = 0;
  let errorCount = 0;

  for (const demoUser of DEMO_USERS) {
    const newHash = bcrypt.hashSync(demoUser.demoPassword, 10);
    const valid = bcrypt.compareSync(demoUser.demoPassword, newHash);

    if (!valid) {
      console.log(`  \u274C  ${demoUser.username}: ERROR - hash generado no valida contrase\u00f1a`);
      errorCount++;
      continue;
    }

    try {
      if (DATA_SOURCE === 'dynamodb' && ALLOW_USER_REPAIR) {
        const { getRepository } = require('../src/db/repositoryFactory');
        const repo = getRepository();

        const user = await repo.findUserByUsername(demoUser.username);
        if (!user) {
          console.log(`  \u26A0\uFE0F  ${demoUser.username}: usuario no encontrado en DynamoDB`);
          continue;
        }

        await repo.update('users', user.id, {
          passwordHash: newHash,
          updatedAt: new Date().toISOString(),
        });

        console.log(`  \u2705  ${demoUser.username}: passwordHash actualizado en DynamoDB`);
        updatedCount++;
      } else {
        console.log(`  \u2705  ${demoUser.username}: hash verificado (password="${demoUser.demoPassword}")`);
        verifiedCount++;
      }
    } catch (err) {
      console.log(`  \u274C  ${demoUser.username}: ERROR - ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\n  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500`);
  console.log(`  Resumen:`);
  if (DATA_SOURCE === 'dynamodb' && ALLOW_USER_REPAIR) {
    console.log(`  Actualizados:   ${updatedCount}`);
  } else {
    console.log(`  Verificados:    ${verifiedCount}`);
  }
  console.log(`  Errores:        ${errorCount}`);
  console.log(`  Total usuarios: ${DEMO_USERS.length}\n`);

  if (errorCount > 0) {
    process.exit(1);
  }
})();
