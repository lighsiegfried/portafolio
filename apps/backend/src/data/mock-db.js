const seed = require('./seed');

let db = { ...seed };

db = JSON.parse(JSON.stringify(seed));

module.exports = db;
