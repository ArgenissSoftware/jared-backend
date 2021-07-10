import UserModel from "../../models/user.model";
import RoleModel from "../../models/role.model";
import PasswordHasher from "../../helper/passwordHasher";

const admin = {
  username: "admin",
  email: "admin@argeniss.com",
  name: "admin",
  surname: "admin",
  birthday: "01-01-1980",
  password: PasswordHasher.hashPassword("admin"),
  roles: <Array<any>>[],
  active: true,
};

export const up = async () => {
  if (UserModel.validateCreate(admin)) {
    try {
      const adminRolId = await RoleModel.find({ name: "Admin" }, "id");
      admin.roles = adminRolId;
      UserModel.create(admin);
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("Admin does not have the correct format");
  }
};
