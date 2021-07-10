import mongoose, { Schema } from "mongoose";
import Joi from "@hapi/joi";
import type { ClientDocument } from "./client.model";
import type { UserDocument } from "./user.model";
import { BaseModel } from "./base.model";
import { BaseDocument } from "./base.document";

export interface ClientDeveloperDocument extends BaseDocument {
  rate: number;
  start: Date;
  end?: Date;
  employee: UserDocument["_id"];
  client: ClientDocument["_id"];
}

const clientsDevelopersModel: Schema = new Schema({
  rate: Number,
  start: Date,
  end: {
    type: Date,
    default: undefined,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clients",
    required: true,
  },
});

const clientDevValidation = Joi.object().keys({
  // id: Joi.string(),
  // _id: Joi.string(),
  // __v: Joi.any(),
  // start: Joi.date().max(Joi.ref("end")),
  // end: Joi.date().min(Joi.ref("start")),
  // rate: Joi.number().min(0),
});

/**
 * Indexes
 */
clientsDevelopersModel.index({ client: 1 });
clientsDevelopersModel.index({ employee: 1 });

/**
 * Validation methods
 */
clientsDevelopersModel.statics.validateCreate = (data: any) => {
  return clientDevValidation.validate(data, { abortEarly: false });
};
clientsDevelopersModel.statics.validateUpdate = (data: any) => {
  return clientDevValidation.validate(data, { abortEarly: false });
};

export interface ClientDeveloperModel extends BaseModel<ClientDeveloperDocument> {}

export default mongoose.model<ClientDeveloperDocument, ClientDeveloperModel>(
  "ClientsDevelopers",
  clientsDevelopersModel
);
