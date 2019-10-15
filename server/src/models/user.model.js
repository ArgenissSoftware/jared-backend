const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const argenissEmail = Joi.string().regex(/^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(argeniss)\.com$/);
const notNumbers = /^([^0-9]*)$/;
const onlyNumbers = /^[0-9]*$/;

/**
 * Schema
 */
const userModel = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    active: { type:  Boolean , default: true },
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
    }],
    roles: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RoleModel'
    }],
});

/**
 * Validation
 */
const userValidation = Joi.object().keys({
  id: Joi.string(),
  _id: Joi.any().id(),
  __v: Joi.any(),
  username: Joi.string().min(3).max(15).required(),
  email: argenissEmail.required(),
  password: Joi.string().min(6).max(16),
  active: Joi.boolean(),
  name: Joi.string().min(2).max(50).regex(notNumbers).required(),
  surname: Joi.string().min(2).max(50).regex(notNumbers).required(),
  cuil: Joi.string().length(11).regex(onlyNumbers),
  passport: Joi.string().min(2).max(50),
  visa: Joi.date().max('now').min(Joi.ref('birthday')),
  address: Joi.string().min(3).max(50),
  phone: Joi.number(),
  cellphone: Joi.number(),
  birthday: Joi.date().min('01-01-1890').less('now').required(),
  skype: Joi.string().min(3).max(50),
  childrenCount: Joi.number().min(0),
  career: Joi.string().min(3).max(50),
  status: Joi.string().min(3).max(50),
  startWorkDate: Joi.date().max('now').min(Joi.ref('birthday')),
  alarmCode: Joi.string().min(3).max(50).regex(onlyNumbers),
  githubID: Joi.string().min(3).max(50),
  relation: Joi.any().valid('freelance', 'hired'),
  clients: Joi.array().unique((a, b) => a.id === b.id),
  roles: Joi.array()
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
  return userValidation.validate(data, { abortEarly: false });
};
userModel.statics.validateUpdate =  (data) => {
  return userValidation.validate(data, { abortEarly: false });
};

userModel.statics.validateUser = (data) => {
  return userValidation.validate(data.toObject(), { abortEarly: false })
};

module.exports = mongoose.model( "UserModel", userModel );
