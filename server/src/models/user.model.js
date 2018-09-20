var mongoose = require('mongoose');
const Joi = require('joi');

const argenissEmail = Joi.string().regex(/^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(argeniss)\.com$/);

/**
 * Schema
 */
var userModel = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    active: Boolean,
    admin: Boolean,
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
      enum: ['freelance', 'hired'],
      default: 'hired'
    },
    clients: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientModel'
    }]
});

/**
 * Validation
 */
const userValidation = Joi.object().keys({
  id: Joi.string(),
  username: Joi.string().min(3).max(15).required(),
  email: argenissEmail.required(),
  password: Joi.string().min(6).max(8),
  active: Joi.boolean().truthy(['yes', '1', 'true']).falsy('no', '0', 'false'),
  admin: Joi.boolean().truthy(['yes', '1', 'true']).falsy('no', '0', 'false'),
  name: Joi.string().min(2).max(50),
  surname: Joi.string().min(2).max(50),
  cuil: Joi.string().min(11).max(11),
  passport: Joi.string().min(2).max(50),
  visa: Joi.date(),
  address: Joi.string().min(3).max(50),
  phone: Joi.number(),
  cellphone: Joi.number(),
  birthday: Joi.date().min('01-01-1890').less('now'),
  skype: Joi.string().min(3).max(50),
  childrenCount: Joi.number().min(0),
  career: Joi.string().min(3).max(50),
  status: Joi.string().min(3).max(50),
  startWorkDate: Joi.date().max('now'),
  alarmCode: Joi.string().min(3).max(50),
  githubID: Joi.string().min(3).max(50),
  relation: Joi.any().valid(['freelance', 'hired']),
  clients: Joi.array().unique((a, b) => a.id === b.id)
});

/**
 * Indexes
 */
userModel.index({username: 1}, {unique: true});
userModel.index({email: 1}, {unique: true});

/**
 * Validation methods
 */
userModel.statics.validateCreate = (data) => {
  return Joi.validate(data, userValidation, { abortEarly: false });
};
userModel.statics.validateUpdate =  (data) => {
  return Joi.validate(data, userValidation, { abortEarly: false });
};

module.exports = mongoose.model( "Usermodel", userModel );
