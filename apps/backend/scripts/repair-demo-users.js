const bcrypt = require('bcryptjs');

const ALLOW_USER_REPAIR = process.env.ALLOW_USER_REPAIR === 'true';
const DATA_SOURCE = process.env.DATA_SOURCE || 'mock';
const DYNAMODB_REGION = process.env.DYNAMODB_REGION || 'us-east-1';
const DYNAMODB_TABLE_PREFIX = process.env.DYNAMODB_TABLE_PREFIX || '(no configurado)';
const USERS_TABLE = `${DYNAMODB_TABLE_PREFIX}-users`;

const DEMO_USERS = [
  { username: 'wilson',    demoPassword: 'admin123' },
  { username: 'compras1',  demoPassword: 'compras123' },
  { username: 'bodega1',   demoPassword: 'bodega123' },
  { username: 'gerencia1', demoPassword: 'gerencia123' },
];

console.log(`
  +------------------------------------------+
  |   Reparacion de Usuarios Demo             |
  |   Solo actualiza passwordHash             |
  +------------------------------------------+
`);
console.log(`  DATA_SOURCE:        ${DATA_SOURCE}`);
console.log(`  ALLOW_USER_REPAIR:  ${ALLOW_USER_REPAIR}`);
console.log(`  Tabla:              ${USERS_TABLE}\n`);

if (!ALLOW_USER_REPAIR) {
  console.log(`  ERROR: ALLOW_USER_REPAIR no está habilitado.`);
  console.log(`  Establezca ALLOW_USER_REPAIR=true para ejecutar la reparación.`);
  process.exit(1);
}

if (DATA_SOURCE !== 'dynamodb') {
  console.log(`  ERROR: Este script solo funciona con DATA_SOURCE=dynamodb (actual: ${DATA_SOURCE}).`);
  process.exit(1);
}

let docClient;

function getDocClient() {
  if (docClient) return docClient;
  const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
  const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
  const client = new DynamoDBClient({ region: DYNAMODB_REGION });
  docClient = DynamoDBDocumentClient.from(client, {
    marshallOptions: { removeUndefinedValues: true },
  });
  return docClient;
}

async function findUserByUsername(username) {
  const client = getDocClient();
  const { QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

  // 1 — Try GSI Query
  try {
    const queryResult = await client.send(new QueryCommand({
      TableName: USERS_TABLE,
      IndexName: 'username-index',
      KeyConditionExpression: 'username = :username',
      ExpressionAttributeValues: { ':username': username },
      Limit: 2,
    }));

    if (queryResult.Items && queryResult.Items.length > 0) {
      if (queryResult.Items.length > 1) {
        throw new Error(`findUserByUsername encontró ${queryResult.Items.length} usuarios con username=${username}`);
      }
      return queryResult.Items[0];
    }
  } catch (err) {
    if (err.name === 'ResourceNotFoundException') {
      console.log(`    GSI username-index no encontrado, usando Scan fallback...`);
    } else {
      console.log(`    Query GSI falló (${err.name}), usando Scan fallback...`);
    }
  }

  // 2 — Scan fallback
  const scanResult = await client.send(new ScanCommand({
    TableName: USERS_TABLE,
    FilterExpression: 'username = :username',
    ExpressionAttributeValues: { ':username': username },
  }));

  if (scanResult.Items && scanResult.Items.length > 0) {
    if (scanResult.Items.length > 1) {
      throw new Error(`findUserByUsername (scan) encontró ${scanResult.Items.length} usuarios con username=${username}`);
    }
    return scanResult.Items[0];
  }

  return null;
}

async function updateUserPasswordHash(userId, passwordHash) {
  const client = getDocClient();
  const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');

  const now = new Date().toISOString();

  const params = {
    TableName: USERS_TABLE,
    Key: { id: userId },
    UpdateExpression: 'SET passwordHash = :passwordHash, updatedAt = :updatedAt',
    ExpressionAttributeValues: {
      ':passwordHash': passwordHash,
      ':updatedAt': now,
    },
    ReturnValues: 'ALL_NEW',
  };

  const result = await client.send(new UpdateCommand(params));
  return result.Attributes || null;
}

(async () => {
  let foundCount = 0;
  let updatedCount = 0;
  let notFoundCount = 0;
  let errorCount = 0;

  for (const demoUser of DEMO_USERS) {
    const newHash = bcrypt.hashSync(demoUser.demoPassword, 10);

    if (!bcrypt.compareSync(demoUser.demoPassword, newHash)) {
      console.log(`  ERROR: ${demoUser.username} - hash generado no valida contra password demo`);
      errorCount++;
      continue;
    }

    try {
      console.log(`  Buscando ${demoUser.username}...`);
      const user = await findUserByUsername(demoUser.username);

      if (!user) {
        console.log(`  NO ENCONTRADO: ${demoUser.username}`);
        notFoundCount++;
        continue;
      }

      foundCount++;
      console.log(`  ENCONTRADO: ${demoUser.username} (role=${user.role})`);

      const updated = await updateUserPasswordHash(user.id, newHash);

      if (!updated) {
        console.log(`  ERROR: ${demoUser.username} - falló la actualización en DynamoDB`);
        errorCount++;
        continue;
      }

      const verifyHash = updated.passwordHash;
      const loginWorks = bcrypt.compareSync(demoUser.demoPassword, verifyHash);
      if (!loginWorks) {
        console.log(`  ERROR: ${demoUser.username} - post-update hash no valida password`);
        errorCount++;
        continue;
      }

      console.log(`  ACTUALIZADO: ${demoUser.username} - passwordHash renovado`);
      updatedCount++;
    } catch (err) {
      console.log(`  ERROR: ${demoUser.username} - ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\n  ${'='.repeat(47)}`);
  console.log(`  Resumen:`);
  console.log(`  Encontrados:    ${foundCount}`);
  console.log(`  Actualizados:   ${updatedCount}`);
  console.log(`  No encontrados: ${notFoundCount}`);
  console.log(`  Errores:        ${errorCount}`);
  console.log(`  Total:          ${DEMO_USERS.length}\n`);

  if (errorCount > 0 || notFoundCount > 0) {
    process.exit(1);
  }
})();
