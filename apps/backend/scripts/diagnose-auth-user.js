const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

if (process.env.ALLOW_AUTH_DIAGNOSE !== 'true') {
  console.error('ERROR: ALLOW_AUTH_DIAGNOSE must be set to true');
  console.error('Uso: ALLOW_AUTH_DIAGNOSE=true AUTH_DIAGNOSE_USERNAME=wilson node scripts/diagnose-auth-user.js');
  process.exit(1);
}

const username = process.env.AUTH_DIAGNOSE_USERNAME || 'wilson';
const password = process.env.AUTH_DIAGNOSE_PASSWORD || '';
const config = require('../src/config');
const { getRepository } = require('../src/db/repositoryFactory');

(async () => {
  console.log('\n=== Diagnóstico de Autenticación ===');
  console.log(`DataSource:     ${config.dataSource}`);
  console.log(`TablePrefix:    ${config.dynamodb.tablePrefix}`);
  console.log(`Username:       ${username}`);
  console.log(`Password provisto: ${password ? 'sí' : 'no'}\n`);

  try {
    const repo = getRepository();
    const user = await repo.findUserByUsername(username);
    const userFound = !!user;
    const hashPresent = userFound ? !!user.passwordHash : false;
    const passwordValid = hashPresent ? repo.verifyPassword(password, user.passwordHash) : false;

    console.log('--- RESULTADOS ---');
    console.log(`user_found:              ${userFound}`);
    if (userFound) {
      console.log(`id:                      ${user.id}`);
      console.log(`role:                    ${user.role}`);
      console.log(`active / isActive:       ${user.active ?? user.isActive ?? 'N/A'}`);
      console.log(`passwordHash_present:    ${hashPresent}`);
      console.log(`password_valid:          ${passwordValid}`);
      console.log(`username_coincide:       ${user.username === username}`);
      console.log(`Campos disponibles:      ${Object.keys(user).sort().join(', ')}`);
      console.log(`passwordHash length:     ${user.passwordHash ? user.passwordHash.length : 0}`);
      console.log(`passwordHash prefix:     ${user.passwordHash ? user.passwordHash.substring(0, 7) + '...' : 'N/A'}`);
    }
    console.log('');
  } catch (err) {
    console.error(`\nERROR: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  }
})();
