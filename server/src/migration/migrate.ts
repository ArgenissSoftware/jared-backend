import fs from "fs";
import db from "../database";
import migrationsModel from "../models/migration.model";
const migrationsUrl = "./migrations/";
const filesList = fs.readdirSync(migrationsUrl);

run();

async function run() {
  const dbConnection = await db.initializeMongo();
  for (const file of filesList) {
    if (file.endsWith('.js')) {
      console.log("Checking " + file);
      try {
        const migration = require(migrationsUrl + file);
        if (await isMigrated(file)) {
          await migration.up();
          await migrationsModel.create({ name: file });
        } else {
          console.log("The migration " + file + " is already up");
        }
      } catch (err) {
        console.log(`Error in ${file}`, err);
      }
    }
  }
  dbConnection.close();
  console.log("DB migration finished");
}

async function isMigrated(migrationName: string) {
  let ret = false;
  const query = await migrationsModel.find({ name: migrationName });
  if (query.length == 0) {
    ret = true;
  } else {
    ret = false;
  }
  return ret;
}