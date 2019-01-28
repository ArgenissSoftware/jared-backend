'use strict'
let Role = require('../src/models/role.model');
exports.up = function(next){
  console.log("En el up de role");
  
  let admin = {id: '5c2bde14aa2c210028b15e54', name: "Admin"};
  let developer = {id: '5c2bde14aa2c210028b15e53', name: "Developer"};
  Role.create(admin);
  Role.create(developer);
};

exports.down = function(next){
  mongoose.Role.pop();
  mongoose.Role.pop();
  delete mongoose.Role;
  next();
};
