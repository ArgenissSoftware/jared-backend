const Role = require('../models/role.model');
const name = "add-role"
const admin = { name: "Admin" };
const developer = { name: "Developer" };

exports.up = async () => {
  if(Role.validateCreate(admin) && Role.validateCreate(developer)) {    
    await Role.create(admin);
    await Role.create(developer); 
  } else {
    console.log("The admin and/or developer roles do not have the correct format");
  }
} 

exports.getName = () => {
  return name;
}