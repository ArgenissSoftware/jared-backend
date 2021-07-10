import RoleModel from "../../models/clientsDevelopers.model";
const admin = { name: "Admin" };
const developer = { name: "Developer" };

export const up = async () => {
  if (RoleModel.validateCreate(admin) && RoleModel.validateCreate(developer)) {
    try {
      await RoleModel.create(admin);
      await RoleModel.create(developer);
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log(
      "The admin and/or developer roles do not have the correct format"
    );
  }
};
