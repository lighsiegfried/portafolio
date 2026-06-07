const config = require('../config');

let cachedRepository = null;

function getRepository() {
  if (cachedRepository) {
    return cachedRepository;
  }

  if (config.dataSource === 'dynamodb') {
    cachedRepository = require('./dynamoRepository');
  } else {
    cachedRepository = require('./mockRepository');
  }

  return cachedRepository;
}

function resetCache() {
  cachedRepository = null;
}

module.exports = { getRepository, resetCache };
