const db = require('../database');
const migrationsModel = require('../models/migration.model');
const Role = require('./add-role');
const Admin = require('./add-admin');

//If you create a new migration, you will need add it to this array 
const migrations = [Role, Admin];

run();

async function run() {
  await db.initializeMongo();
  for(const migration of migrations) {
    if(await isMigrated(migration.getName())) {      
      migrationsModel.create({name: migration.getName()});
      migration.up();
    } else {
      console.log("The migration " + migration.getName() + " is already up");
    }
  }
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
