import type { Model } from "mongoose";
import Joi from "@hapi/joi";
import { BaseDocument } from "./base.document";

/**
 * Base Model
 */
export interface BaseModel<D extends BaseDocument> extends Model<D> {
  validateCreate(data: any): Joi.ValidationResult;
  validateUpdate(data: any): Joi.ValidationResult;
}
