const Joi = require('joi');

const argenissEmail = Joi.string().regex(/^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(argeniss)\.com$/);
const url = Joi.string().regex(/\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i);
const commonEmail = Joi.string().email({ minDomainAtoms: 2 });

const userSchema = Joi.object().keys({
    username: Joi.string().min(3).max(15).required(),
    email: argenissEmail.required(),
    password: Joi.string().min(6).max(8).required(),
    active: Joi.boolean().truthy(['yes','1','true']).falsy('no','0','false'),
    admin: Joi.boolean().truthy(['yes','1','true']).falsy('no','0','false'),
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
    relation: Joi.any().valid( ['freelance', 'hired'])
});

const clientSchema = Joi.object().keys({
    name: Joi.string().min(3).max(100).required(),
    contactName: Joi.string().min(3).max(50),
    email: commonEmail,
    address: Joi.string().min(3).max(50),
    url: url,
    active: Joi.boolean().truthy(['yes','1','true']).falsy('no','0','false')
});


function userValidation(data){
    return Joi.validate(data, userSchema, {abortEarly:false} );
}

function clientValidation(data){
    return Joi.validate(data, clientSchema,{abortEarly:false});
}

module.exports = {
    userValidation: userValidation,
    clientValidation: clientValidation
};