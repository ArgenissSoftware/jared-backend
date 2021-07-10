import mongoose, { Schema } from "mongoose";
import Joi from "@hapi/joi";
import type { BaseModel } from "./base.model";
import { BaseDocument } from "./base.document";

const url = Joi.string().regex(
  /\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i
);
const commonEmail = Joi.string().email({ minDomainSegments: 2 });

export interface ClientDocument extends BaseDocument {
  name: string;
  contactName: string;
  email: string;
  address: string;
  url: string;
}

const clientSchema: Schema = new Schema({
  name: String,
  contactName: String,
  email: String,
  address: String,
  url: String,
  active: { type: Boolean, default: true },
});

const clientValidation = Joi.object().keys({
  id: Joi.string(),
  _id: Joi.string(),
  __v: Joi.any(),
  name: Joi.string().min(2).max(100).required(),
  contactName: Joi.string().min(3).max(50),
  email: commonEmail,
  address: Joi.string().min(3).max(50),
  url: url,
  active: Joi.boolean(),
});

/**
 * Indexes
 */
clientSchema.index({ name: 1 }, { unique: true });

/**
 * Validation methods
 */
clientSchema.statics.validateCreate = (data: any): Joi.ValidationResult => {
  return clientValidation.validate(data, { abortEarly: false });
};
clientSchema.statics.validateUpdate = (data: any) => {
  return clientValidation.validate(data, { abortEarly: false });
};

// For model
export interface ClientModel extends BaseModel<ClientDocument> {}

export default mongoose.model<ClientDocument, ClientModel>("Clients", clientSchema);
