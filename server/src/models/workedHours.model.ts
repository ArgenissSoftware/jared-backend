import mongoose, { Schema } from "mongoose";
import Joi from "@hapi/joi";
import { ClientDocument } from "./client.model";
import { BaseDocument } from "./base.document";
import { UserDocument } from "./user.model";
import { BaseModel } from "./base.model";

export interface WorkedHoursDocument extends BaseDocument {
  client: ClientDocument["_id"];
  user: UserDocument["_id"];
  day: Date,
  hours: number;
}

const WorkedHoursSchema = new Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Clients" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  day: Date,
  hours: Number,
});

const workedHoursValidation = Joi.object().keys({
  id: Joi.string(),
  _id: Joi.string(),
  __v: Joi.any(),
  client: Joi.string().required(),
  user: Joi.string().required(),
  day: Joi.date().default("now").required(),
  hours: Joi.number().min(0).max(24).required(),
});

/**
 * indexes
 */
WorkedHoursSchema.index({ userId: 1, clientId: 1, day: 1 }, { unique: true });

/**
 * validation methods
 */
WorkedHoursSchema.statics.validateCreate = (data: any) => {
  return workedHoursValidation.validate(data, { abortEarly: false });
};
WorkedHoursSchema.statics.validateUpdate = (data: any) => {
  return workedHoursValidation.validate(data, { abortEarly: false });
};

// For model
export interface WorkedHoursModel extends BaseModel<WorkedHoursDocument> {}

export default mongoose.model<WorkedHoursDocument, WorkedHoursModel>("WorkedHoursModel", WorkedHoursSchema);
