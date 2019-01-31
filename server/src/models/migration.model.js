const mongoose = require('mongoose');

const migrationModel = mongoose.Schema({
  name: String
});

module.exports = mongoose.model("MigrationModel", migrationModel);