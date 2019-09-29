const fs = require('fs');
const db = require('../database');
const migrationsModel = require('../models/migration.model');
const migrationsUrl = "./migrations/";
const filesList = fs.readdirSync(migrationsUrl);

run();

async function run() {
  const dbConnection = await db.initializeMongo();
  for (const file of filesList) {
    const migration = require(migrationsUrl + file);
    if( await isMigrated(file)) {
      await migration.up();
      migrationsModel.create({name: file});
    } else {
      console.log("The migration " + file + " is already up");
    }
  }
  dbConnection.close();
  console.log('DB migration finished');
}

async function isMigrated(migrationName) {
  let ret = false;
  const query = await migrationsModel.find({name: migrationName});
  if(query.length == 0) {
    ret = true;
  } else {
    ret = false;
  }
  return ret;
}

