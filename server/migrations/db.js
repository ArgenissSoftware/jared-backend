const database = require('../src/database');
database.initializeMongo();

const Role = require('./1548354035723-add-role');
Role.up;
module.exports = database;