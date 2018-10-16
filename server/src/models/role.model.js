var mongoose = require('mongoose');
const Joi = require('joi');

/**
 * Schema
 */
var roleModel = mongoose.Schema({
    name: String,
    active: Boolean,
});

/**
 * Validation
 */
const roleValidation = Joi.object().keys({
  id: Joi.string(),
  name: Joi.string().min(3).max(255).required(),
  active: Joi.boolean().truthy(['yes', '1', 'true']).falsy('no', '0', 'false'),
});

/**
 * Indexes
 */
roleModel.index({name: 1}, {unique: true});

/**
 * Validation methods
 */
roleModel.statics.validateCreate = (data) => {
  return Joi.validate(data, roleValidation, { abortEarly: false });
};
roleModel.statics.validateUpdate =  (data) => {
  return Joi.validate(data, roleValidation, { abortEarly: false });
};

module.exports = mongoose.model( "RoleModel", roleModel );
