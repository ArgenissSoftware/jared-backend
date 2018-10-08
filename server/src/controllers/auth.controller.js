const BaseRestController = require('./base-rest.controller');
const ValidationArgenissFormat = require('../helper/validationArgenissEmail');
const PasswordHasher = require('../helper/passwordHasher');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/user.repository');
const repoUser = new UserRepository();


class AuthController extends BaseRestController {


  registerRoutes() {
    this.router.post("/login", this.login.bind(this));
    this.router.get("/refreshToken", this.refreshToken.bind(this));
  }

  login(req, res) {
  
    //check format email
    if (!ValidationArgenissFormat(req.body.email)) {
      this._error(res, "Failed to login. Email with invalid format");
      return;
    }

    // check if user exist
    repoUser.findOneToLogin(req.body.email, (err, result) => {
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


  refreshToken(req, res) {
    var token = req.body.token || req.query.token || req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Invalid Token' });
    }
    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
      if (err) {
        return res.status(401).json({ message: 'Invalid Token or secret' });
      }
      repoUser.findOne(
         user._id
      ,  (err, data) => {
         if (!err) {
          const token = PasswordHasher.generateToken(data);
          data = {
            message: "Refresh Token OK",
            token: token,
            user: data
          };
        }
        this._sendResponse(res, err, data);
      });
    });
  };

}

module.exports = AuthController;