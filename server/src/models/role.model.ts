import mongoose, { Schema } from "mongoose";
import Joi from "@hapi/joi";
import type { BaseModel } from "./base.model";
import { BaseDocument } from "./base.document";

export interface RoleDocument extends BaseDocument {
  name: string;
}

const roleSchema = new Schema({
  name: String,
  active: { type: Boolean, default: true },
});

const roleValidation = Joi.object().keys({
  id: Joi.string(),
  _id: Joi.string(),
  __v: Joi.any(),
  name: Joi.string().min(4).max(255).required(),
});

/**
 * Indexes
 */
roleSchema.index({ name: 1 }, { unique: true });

/**
 * Validation methods
 */
roleSchema.statics.validateCreate = (data: any) => {
  return roleValidation.validate(data, { abortEarly: false });
};
roleSchema.statics.validateUpdate = (data: any) => {
  return roleValidation.validate(data, { abortEarly: false });
};


// For model
export interface RoleModel extends BaseModel<RoleDocument> {}

export default mongoose.model<RoleDocument, RoleModel>("Roles", roleSchema);
