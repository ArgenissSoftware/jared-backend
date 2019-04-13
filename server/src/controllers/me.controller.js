const BaseRestController = require('./base-rest.controller');
const ValidationData = require('../helper/validationIncomingData');
const MailSender = require("../helper/mailSender");
const crypto = require('crypto');
const PasswordHasher = require('../helper/passwordHasher');
const UserRepository = require('../repositories/user.repository');


/**
 * Profile controller
 */
class MeController extends BaseRestController {


  registerRoutes() {
    this.router.get('/forgot_password', this.forgotPassword.bind(this))
    this.router.put('/reset_password', this.resetPassword.bind(this))
  }

  forgotPassword(req, res) {

    var fieldToValidate = ["email"];
    var errorMessage = ValidationData(fieldToValidate, req.query);

    if (errorMessage != "") {
      this._error(res, errorMessage);
    }

    crypto.randomBytes(20, function (err, buffer) {

      var token = buffer.toString('hex');

      //86400000 ms = 24hs
      const repo = new UserRepository();
      repo.resetExpires(req.query.email, token, Date.now() + 60 * 60 * 24 * 1000, (err, user) => {

        if (err) {
          this._error(res, "User not found");
          return;
        }

        //this URL must be a front-end URL. For testing purposes, I'm sending the id and the token which can be used to reset the password
        var resetPasswordURL = 'http://localhost:3000/api/users/reset_password/ ID: ' + user._id + " Token: " + "-" + token + "-";

        errorMessage = MailSender.mailSender(
          [`${user.name} ${user.surname} ${user.email}`],
          'resetPassword',
          {
            name: user.name,
            resetPasswordURL: resetPasswordURL
          }
        );

        if (errorMessage) {
          this._error(res, errorMessage);
        }

        let response = {
          status: 200,
          errorInfo: "",
          data: {
            message: "An email was sent to the account you provided"
          }
        }

        res.status(200).json(response).end();

      });
    });

  }

  resetPassword(req, res) {

    var fieldToValidate = ["id", "token", "password", "password_confirmation"];
    var errorMessage = ValidationData(fieldToValidate, req.body);

    if (errorMessage != "") {
      this._error(res, errorMessage);
    }
    const repo = new UserRepository();
    repo.patch(req.body.id, { reset_password_expires: undefined, reset_password_token: undefined }, (error, user) => {
      if (error) {
        this._error(res, "User not found");
      }
      else if (req.body.token !== user.reset_password_token) {
        this._error(res, "Invalid token");
      }
      else if (user.reset_password_expires < Date.now()) {
        this._error(res, "Expired token");
      }

      else {
        updateUserPassword(req, res);
      }
    })
  }

}
module.exports = MeController;