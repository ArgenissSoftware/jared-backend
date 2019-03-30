const UserModel = require('../../models/user.model');
const RoleModel = require('../../models/role.model');

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
  if(UserModel.validateCreate(admin)) {
    try {
      adminRolId = await RoleModel.find({name: "Admin"}, 'id');    
      admin.roles = adminRolId;
      UserModel.create(admin);
    } catch(err) {
      console.log(err);      
    }

  } else {
    console.log("Admin does not have the correct format");
  }
}