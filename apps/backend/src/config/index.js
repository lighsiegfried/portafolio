const path = require('path');

try {
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
} catch (e) {
}

const validDataSources = ['mock', 'dynamodb'];
const rawDataSource = (process.env.DATA_SOURCE || 'mock').toLowerCase();

if (!validDataSources.includes(rawDataSource)) {
  throw new Error(`DATA_SOURCE inválido: '${process.env.DATA_SOURCE}'. Debe ser uno de: ${validDataSources.join(', ')}`);
}

const config = {
  dataSource: rawDataSource,
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  dynamodb: {
    tablePrefix: process.env.DYNAMODB_TABLE_PREFIX || 'mini-erp',
    region: process.env.DYNAMODB_REGION || 'us-east-1',
  },
  server: {
    port: parseInt(process.env.PORT, 10) || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'INFO',
  },
  business: {
    defaultLowStockThreshold: parseInt(process.env.DEFAULT_LOW_STOCK_THRESHOLD, 10) || 5,
  },
};

module.exports = config;
