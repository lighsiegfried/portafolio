const bcrypt = require('bcryptjs');

const DEMO_USERS = [
  { username: 'wilson',    demoPassword: 'admin123' },
  { username: 'compras1',  demoPassword: 'compras123' },
  { username: 'bodega1',   demoPassword: 'bodega123' },
  { username: 'gerencia1', demoPassword: 'gerencia123' },
];

const DATA_SOURCE = process.env.DATA_SOURCE || 'mock';

async function main() {
  console.log(`
  +------------------------------------------+
  |   Verificacion de Passwords Demo          |
  +------------------------------------------+
`);
  console.log(`  DATA_SOURCE: ${DATA_SOURCE}\n`);

  let usersToCheck;

  if (DATA_SOURCE === 'dynamodb') {
    usersToCheck = await loadUsersFromDynamo();
  } else {
    usersToCheck = loadUsersFromMock();
  }

  let okCount = 0;
  let failCount = 0;

  for (const demoUser of DEMO_USERS) {
    const record = usersToCheck.find(u => u.username === demoUser.username);
    const found = !!record;
    const hashPresent = found && !!record.passwordHash;
    let passwordValid = false;

    if (hashPresent) {
      passwordValid = bcrypt.compareSync(demoUser.demoPassword, record.passwordHash);
    }

    console.log(`    username:             ${demoUser.username}`);
    console.log(`    found:                ${found}`);
    console.log(`    passwordHash_present: ${hashPresent}`);
    console.log(`    password_valid:       ${passwordValid}`);
    console.log(`    ---------------------------------------`);

    if (passwordValid) okCount++;
    else failCount++;
  }

  console.log(`\n  Resumen:`);
  console.log(`  Validas:   ${okCount}`);
  console.log(`  Invalidas: ${failCount}`);
  console.log(`  Total:     ${DEMO_USERS.length}\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

function loadUsersFromMock() {
  const { users } = require('../src/data/fixtures/users');
  return users;
}

async function loadUsersFromDynamo() {
  const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
  const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

  const region = process.env.DYNAMODB_REGION || 'us-east-1';
  const tablePrefix = process.env.DYNAMODB_TABLE_PREFIX || 'portafolio-production';
  const tableName = `${tablePrefix}-users`;

  console.log(`  Conectando a DynamoDB: ${tableName} (${region})\n`);

  const client = new DynamoDBClient({ region });
  const docClient = DynamoDBDocumentClient.from(client, {
    marshallOptions: { removeUndefinedValues: true },
  });

  const result = await docClient.send(new ScanCommand({
    TableName: tableName,
    FilterExpression: 'username IN (:u1, :u2, :u3, :u4)',
    ExpressionAttributeValues: {
      ':u1': 'wilson',
      ':u2': 'compras1',
      ':u3': 'bodega1',
      ':u4': 'gerencia1',
    },
  }));

  return result.Items || [];
}

main().catch((err) => {
  console.error(`  ERROR: ${err.message}`);
  process.exit(1);
});
