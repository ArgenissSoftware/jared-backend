'use strict'
var mongoose = require('./db');

exports.up = function(next){
  mongoose.Role = [];
  mongoose.Role.push('Admin');
  mongoose.Role.push('Developer', next);
};

exports.down = function(next){
  mongoose.Role.pop();
  mongoose.Role.pop();
  delete mongoose.Role;
  next();
};
