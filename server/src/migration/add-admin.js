const userModel = require('../models/user.model');
const rolModel = require('../models/role.model');

const name = "add-admin"
const admin = {
  username: "admin",
  email: "admin@argeniss.com",
  name: "admin",
  surname: "admin",
  birthday: '01-01-1980',
  roles: [],
  active: true
}

exports.up = async () => {
  if(userModel.validateCreate(admin)) {
    adminRolId = await rolModel.find({name: "Admin"}, 'id');    
    admin.roles = adminRolId;
    userModel.create(admin);
  } else {
    console.log("Admin does not have the correct format");
  }
}

exports.getName = () => {
  return name;
}
