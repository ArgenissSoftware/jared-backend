var mongoose = require('mongoose');

var userModel = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    active: Boolean,
    //employee data
    name: String,
    surname: String,
    cuil: Number,
    passport: String,
    visa: Date,
    address: String,
    phone: Number,
    cellphone: Number,
    birthday: Date,
    email: String,
    skype: String,
    childrenCount: Number,
    career: String,
    status: String,
    startWorkDate: Date,
    relation: {
      type: String,
      enum: ['freelance', 'hired'],
      default: 'hired'
    },
    clients: [{
      type: Number,
      ref: 'Client'
    }]
});

userModel.method("usernameIsValid", function(){
  return this.username;
});

userModel.method("emailIsValid", function(){
  return this.email && this.email.indexOf("@") > -1;
});

userModel.method("passwordIsValid", function(){
  return this.password;
});

userModel.method("userIsValid", function(){
  return this.usernameIsValid && this.emailIsValid && this.passwordIsValid;
});

module.exports = mongoose.model( "Usermodel", userModel );
