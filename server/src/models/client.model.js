var mongoose = require('mongoose');
const Joi = require('joi');

const url = Joi.string().regex(/\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i);
const commonEmail = Joi.string().email({ minDomainAtoms: 2 });

var clientModel = mongoose.Schema({
    name: String,
    contactName: String,
    email: String,
    address: String,
    url: String,
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    }],
    active: { type: Boolean, default: true }
});


const clientValidation = Joi.object().keys({
    id: Joi.string(),
    _id: Joi.string(),
    __v: Joi.any(),
    name: Joi.string().min(3).max(100).required(),
    contactName: Joi.string().min(3).max(50),
    email: commonEmail,
    address: Joi.string().min(3).max(50),
    url: url,
    active: Joi.boolean().truthy(['yes', '1', 'true']).falsy('no', '0', 'false'),
    employees: Joi.array().unique((a, b) => a.id === b.id)
});

/**
 * Indexes
 */
clientModel.index({name: 1}, {unique: true});

/**
 * Validation methods
 */
clientModel.statics.validateCreate = (data) => {
    return Joi.validate(data, clientValidation, { abortEarly: false });
};
clientModel.statics.validateUpdate = (data) => {
    return Joi.validate(data, clientValidation, { abortEarly: false });
};

module.exports = mongoose.model("ClientModel", clientModel);
