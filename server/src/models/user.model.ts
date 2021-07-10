import mongoose, { Schema } from "mongoose";
import Joi from "@hapi/joi";
import type { BaseModel } from "./base.model";
import type { RoleDocument } from "./role.model";
import { BaseDocument } from "./base.document";

const notNumbers = /^([^0-9]*)$/;
const onlyNumbers = /^[0-9]*$/;

export type RelationType = "freelance" | "hired";

export interface UserDocument extends BaseDocument {
  username: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  cuil: string;
  passport: string;
  visa: Date;
  address: string;
  phone: string;
  cellphone: string;
  birthday: Date;
  skype: string;
  childrenCount: number;
  career: string;
  status: string;
  startWorkDate: Date;
  alarmCode: string;
  githubID: string;
  reset_password_token: string;
  reset_password_expires: Date;
  relation: RelationType;
  roles?: Array<RoleDocument>;
}

/**
 * Schema
 */
const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  active: { type: Boolean, default: true },
  //employee data
  name: String,
  surname: String,
  cuil: String,
  passport: String,
  visa: Date,
  address: String,
  phone: String,
  cellphone: String,
  birthday: Date,
  skype: String,
  childrenCount: Number,
  career: String,
  status: String,
  startWorkDate: Date,
  alarmCode: String,
  githubID: String,
  reset_password_token: String,
  reset_password_expires: Date,
  relation: {
    type: String,
    enum: ["freelance", "hired"],
    default: "hired",
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roles",
    },
  ],
});

userSchema.virtual('clients', {
  ref: 'ClientsDevelopers',
  localField: '_id',
  foreignField: 'employee',
  // options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});

/**
 * Validation
 */
const userValidation = Joi.object().keys({
  id: Joi.string(),
  _id: Joi.any().id(),
  __v: Joi.any(),
  username: Joi.string().min(3).max(15).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).max(16),
  active: Joi.boolean(),
  name: Joi.string().min(2).max(50).regex(notNumbers).required(),
  surname: Joi.string().min(2).max(50).regex(notNumbers).required(),
  cuil: Joi.string().length(11).regex(onlyNumbers),
  passport: Joi.string().min(2).max(50),
  visa: Joi.date().max("now").min(Joi.ref("birthday")),
  address: Joi.string().min(3).max(50),
  phone: Joi.number(),
  cellphone: Joi.number(),
  birthday: Joi.date().min("01-01-1890").less("now").required(),
  skype: Joi.string().min(3).max(50),
  childrenCount: Joi.number().min(0),
  career: Joi.string().min(3).max(50),
  status: Joi.any().valid("finished", "unfinished", "ongoing"),
  startWorkDate: Joi.date().max("now").min(Joi.ref("birthday")),
  alarmCode: Joi.string().min(3).max(50).regex(onlyNumbers),
  githubID: Joi.string().min(3).max(50),
  relation: Joi.any().valid("freelance", "hired"),
  roles: Joi.array(),
});

/**
 * Indexes
 */
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

/**
 * Validation methods
 */
userSchema.statics.validateCreate = (data: any) => {
  return userValidation.validate(data, { abortEarly: false });
};
userSchema.statics.validateUpdate = (data: any) => {
  return userValidation.validate(data, { abortEarly: false });
};

userSchema.statics.validateUser = (data: any) => {
  return userValidation.validate(data.toObject(), { abortEarly: false });
};

// For model
export interface UserModel extends BaseModel<UserDocument> {}

export default mongoose.model<UserDocument, UserModel>("Users", userSchema);
