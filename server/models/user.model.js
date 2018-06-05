var mongoose = require('mongoose');

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
    email: String,
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

userModel.index({username: 1}, {unique: true});
userModel.index({email: 1}, {unique: true});

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
