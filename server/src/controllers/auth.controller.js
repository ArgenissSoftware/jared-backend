const BaseRestController = require('./base-rest.controller');
const ValidationArgenissFormat = require('../helper/validationArgenissEmail');
const UserModel = require('../models/user.model');
const PasswordHasher = require('../helper/passwordHasher');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/user.repository');



/**
 * Auth controller
 */
class AuthController extends BaseRestController {

  /**
   * Register controller routes
   */
  registerRoutes() {
    this.router.post("/login", this.login.bind(this));
    this.router.get("/refreshToken", this.refreshToken.bind(this));
  }

  /**
   * Login
   */
  login(req, res) {

    //check format email
    if (!ValidationArgenissFormat(req.body.email)) {
      this._error(res, "Failed to login. Email with invalid format");
      return;
    }

    // check if user exist
    const repo = new UserRepository();
    repo.findOneToLogin(req.body.email, (err, result) => {
      let user = null
      if (result.length > 0) {
        user = result[0]
      }
      if (!user) {
        this._error(res, "Failed to login. User doesn't exist!")
        return
      }

      if (!user.active) {
        this._error(res, "Failed to login. User disabled")
        return
      }

      var isCorrectPassword = PasswordHasher.validatePassword(req.body.password, user.password)
      if (!isCorrectPassword) {
        this._error(res, "Failed to login. Invalid password!")
        return
      }

      var token = PasswordHasher.generateToken(user);
      var data = { message: "Login correct!", token: token, user: user };
      this._success(res, data);

    });
  };

  /**
   * Refresh auth token
   */
  refreshToken(req, res) {
    var token = req.body.token || req.query.token || req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Invalid Token' });
    }
    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
      if (err) {
        return res.status(401).json({ message: 'Invalid Token or secret' });
      }
      const repo = new UserRepository();
      repo.findOne(
        user._id
        , (err, data) => {
          if (!err) {
            const token = PasswordHasher.generateToken(data);
            data = {
              message: "Refresh Token OK",
              token: token,
              user: data
            };
          }
          this._success(res, data);
        });
    });
  };

}

module.exports = AuthController;