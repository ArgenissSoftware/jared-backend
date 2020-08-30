import mongoose, { Schema } from "mongoose";

const migrationModel = new Schema({
  name: String,
});

export default mongoose.model("MigrationModel", migrationModel);
