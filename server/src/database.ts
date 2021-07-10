const mongoose = require("mongoose");
const env =
  process.env.NODE_ENV === "production" ? "production" : "development";
import config from "./config/config";
const configEnv = config[env];
const DATABASE_CONECTION = `${configEnv.jaredDB.host}`;
//mongodb://<dbuser>:<dbpassword>@ds155695.mlab.com:55695/heroku_hs0vhjv0

export default {
  initializeMongo() {
    console.log("Connecting to mongodb...." + DATABASE_CONECTION);
    mongoose.connect(DATABASE_CONECTION);
    mongoose.set("bufferCommands", false);
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "Connection error"));
    db.once("open", function () {
      console.log("Connection successfull");
    });
    return db;
  },
};
