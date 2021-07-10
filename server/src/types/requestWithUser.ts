import { Request } from "express";

export type RequestUser = {
  username: string;
  email: string;
  roles: Array<string>;
  _id: string;
};

interface RequestWithUser extends Request {
  user: RequestUser;
}

export default RequestWithUser;
