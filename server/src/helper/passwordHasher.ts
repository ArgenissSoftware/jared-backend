import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserDocument } from "../models/user.model";
const saltRounds = 10;

function validatePassword(password: string, passwordHash: string) {
  return bcrypt.compareSync(password, passwordHash);
}

function hashPassword(passwordToHash: string) {
  return bcrypt.hashSync(passwordToHash, saltRounds);
}

function generateToken(user: UserDocument) {
  let u = {
    username: user.username,
    email: user.email,
    roles: user.roles.map((r) => r.name),
    _id: user._id.toString(),
  };

  return jwt.sign(u, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24,
  });
}

export default {
  validatePassword: validatePassword,
  hashPassword: hashPassword,
  generateToken: generateToken,
};
