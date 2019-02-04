const RoleModel = require('../../models/role.model');
const admin = { name: "Admin" };
const developer = { name: "Developer" };

exports.up = async () => {  
  if(RoleModel.validateCreate(admin) && RoleModel.validateCreate(developer)) {    
    try{
      await RoleModel.create(admin);
      await RoleModel.create(developer);
    } catch(err) {
      console.log(err);
    }
  } else {
    console.log("The admin and/or developer roles do not have the correct format");
  }
} 