var mongoose = require('mongoose');
const Joi = require('joi');

const commonEmail = Joi.string().email({ minDomainAtoms: 2 });

var roleModel = mongoose.Schema({
    name: String,
    active: { type: Boolean, default: true }
});


const roleValidation = Joi.object().keys({
    id: Joi.string(),
    _id: Joi.string(),
    __v: Joi.any(),
    name: Joi.string().min(1).max(255).required(),
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
roleModel.statics.validateUpdate = (data) => {
    return Joi.validate(data, roleValidation, { abortEarly: false });
};

module.exports = mongoose.model("RoleModel", roleModel);
