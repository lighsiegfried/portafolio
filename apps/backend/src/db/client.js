const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const config = require('../config');

let docClient = null;

function getClient() {
  if (docClient) {
    return docClient;
  }

  const isOffline = config.server.nodeEnv === 'development' && !process.env.AWS_ACCESS_KEY_ID;

  const clientConfig = {
    region: config.dynamodb.region,
  };

  if (isOffline) {
    clientConfig.endpoint = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000';
    clientConfig.credentials = {
      accessKeyId: 'fake-access-key',
      secretAccessKey: 'fake-secret-key',
    };
  }

  const client = new DynamoDBClient(clientConfig);

  docClient = DynamoDBDocumentClient.from(client, {
    marshallOptions: {
      removeUndefinedValues: true,
    },
  });

  return docClient;
}

function tableName(entity) {
  return `${config.dynamodb.tablePrefix}-${entity}`;
}

module.exports = { getClient, tableName };
