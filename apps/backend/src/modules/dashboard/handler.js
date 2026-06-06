const response = require('../../utils/response');
const repo = require('../../db/mockRepository');

async function summary(event) {
  const data = repo.getDashboardSummary();
  return response.success(data);
}

module.exports = { summary };
