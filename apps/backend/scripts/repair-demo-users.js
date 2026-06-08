const bcrypt = require('bcryptjs');

const ALLOW_USER_REPAIR = process.env.ALLOW_USER_REPAIR === 'true';
const DATA_SOURCE = process.env.DATA_SOURCE || 'mock';
const DYNAMODB_TABLE_PREFIX = process.env.DYNAMODB_TABLE_PREFIX || '(no configurado)';

const DEMO_USERS = [
  { username: 'wilson',    demoPassword: 'admin123' },
  { username: 'compras1',  demoPassword: 'compras123' },
  { username: 'bodega1',   demoPassword: 'bodega123' },
  { username: 'gerencia1', demoPassword: 'gerencia123' },
];

console.log(`
  +------------------------------------------+
  |   Reparacion de Usuarios Demo             |
  +------------------------------------------+
`);
console.log(`  DATA_SOURCE:       ${DATA_SOURCE}`);
console.log(`  ALLOW_USER_REPAIR: ${ALLOW_USER_REPAIR}`);
console.log(`  Tabla:            ${DYNAMODB_TABLE_PREFIX}-users\n`);

if (!ALLOW_USER_REPAIR) {
  console.log(`  ERROR: ALLOW_USER_REPAIR no está habilitado.`);
  console.log(`  Establezca ALLOW_USER_REPAIR=true para ejecutar la reparación.`);
  process.exit(1);
}

if (DATA_SOURCE !== 'dynamodb') {
  console.log(`  ERROR: Este script solo funciona con DATA_SOURCE=dynamodb (actual: ${DATA_SOURCE}).`);
  process.exit(1);
}

(async () => {
  let updatedCount = 0;
  let errorCount = 0;

  let repo;
  try {
    repo = require('../src/db/repositoryFactory').getRepository();
  } catch (err) {
    console.log(`  ERROR al cargar repositorio: ${err.message}`);
    process.exit(1);
  }

  for (const demoUser of DEMO_USERS) {
    const newHash = bcrypt.hashSync(demoUser.demoPassword, 10);

    if (!bcrypt.compareSync(demoUser.demoPassword, newHash)) {
      console.log(`  ERROR: ${demoUser.username} - hash generado no valida contra password demo`);
      errorCount++;
      continue;
    }

    const hashPrefix = newHash.substring(0, 10);
    console.log(`  Hash OK prefix: ${hashPrefix}...`);

    try {
      console.log(`  Buscando ${demoUser.username}...`);
      const user = await repo.findUserByUsername(demoUser.username);

      if (!user) {
        console.log(`  NO ENCONTRADO: ${demoUser.username} - no existe en DynamoDB`);
        errorCount++;
        continue;
      }

      console.log(`  ENCONTRADO: ${demoUser.username} (id=${user.id}, role=${user.role})`);

      const updated = await repo.update('users', user.id, {
        passwordHash: newHash,
      });

      if (!updated) {
        console.log(`  ERROR: ${demoUser.username} - falló la actualización en DynamoDB`);
        errorCount++;
        continue;
      }

      const verifyHash = updated.passwordHash || updated.passwordHash;
      const loginWorks = bcrypt.compareSync(demoUser.demoPassword, verifyHash);
      if (!loginWorks) {
        console.log(`  ERROR: ${demoUser.username} - post-update hash no valida password`);
        errorCount++;
        continue;
      }

      console.log(`  ACTUALIZADO: ${demoUser.username} - passwordHash renovado en DynamoDB`);
      updatedCount++;
    } catch (err) {
      console.log(`  ERROR: ${demoUser.username} - ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\n  -----------------------------------------------`);
  console.log(`  Resumen:`);
  console.log(`  Actualizados:   ${updatedCount}`);
  console.log(`  Errores:        ${errorCount}`);
  console.log(`  Total usuarios: ${DEMO_USERS.length}\n`);

  if (errorCount > 0) {
    process.exit(1);
  }
})();
