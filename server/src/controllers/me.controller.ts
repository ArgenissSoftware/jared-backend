import BaseRestController from "./base-rest.controller";
import ValidationData from "../helper/validationIncomingData";
import MailSender from "../helper/mailSender";
import crypto from "crypto";
import UserRepository from "../repositories/user.repository";
import { Request, Response } from "express";
import { UserDocument } from "../models/user.model";

/**
 * Profile controller
 */
class MeController extends BaseRestController {
  registerRoutes() {
    this.router.get("/forgot_password", this.forgotPassword.bind(this));
    this.router.put("/reset_password", this.resetPassword.bind(this));
  }

  forgotPassword(req: Request, res: Response) {
    var fieldToValidate = ["email"];
    var errorMessage = ValidationData(fieldToValidate, req.query);

    if (errorMessage != "") {
      this._error(res, errorMessage);
    }

    crypto.randomBytes(20, async (err, buffer) => {
      var token = buffer.toString("hex");

      //86400000 ms = 24hs
      const repo = new UserRepository();
      try {
        const user: UserDocument = await repo.resetExpires(
          req.query.email as string,
          token,
          new Date(Date.now() + 60 * 60 * 24 * 1000)
        );
        //this URL must be a front-end URL. For testing purposes, I'm sending the id and the token which can be used to reset the password
        var resetPasswordURL =
          "http://localhost:3000/api/users/reset_password/ ID: " +
          user._id +
          " Token: " +
          "-" +
          token +
          "-";

        errorMessage = MailSender.mailSender(
          [`${user.name} ${user.surname} ${user.email}`],
          "resetPassword",
          {
            name: user.name,
            resetPasswordURL: resetPasswordURL,
          }
        );

        if (errorMessage) {
          this._error(res, errorMessage);
        }

        let response = {
          status: 200,
          errorInfo: "",
          data: {
            message: "An email was sent to the account you provided",
          },
        };

        res.status(200).json(response).end();
      } catch (error) {
        this._error(res, "User not found");
        return;
      }
    });
  }

  async resetPassword(req: Request, res: Response) {
    var fieldToValidate = ["id", "token", "password", "password_confirmation"];
    var errorMessage = ValidationData(fieldToValidate, req.body);

    if (errorMessage != "") {
      this._error(res, errorMessage);
    }
    const repo = new UserRepository();


    try {
      const user = await repo.patch(
        req.body.id,
        { reset_password_expires: undefined, reset_password_token: undefined }
      );
      if (req.body.token !== user.reset_password_token) {
        this._error(res, "Invalid token");
      } else if (user.reset_password_expires.getTime() < Date.now()) {
        this._error(res, "Expired token");
      } else {
        // TODO: Implement update user password
        // updateUserPassword(req: Request, res: Response);
      }
    } catch (error) {
      this._error(res, "User not found");
    }
  }
}
export default MeController;
