const BaseRestController = require('./base-rest.controller');
const ValidationArgenissFormat = require('../helper/validationArgenissEmail');
const PasswordHasher = require('../helper/passwordHasher');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/user.repository');

/**
 * Auth controller
 */
class AuthController extends BaseRestController {

  /**
   * Constructor
   * @param {string} basePath
   * @param {parentRouter} parentRouter
   */
  constructor(basePath, parentRouter) {
    super(basePath, parentRouter);
    this.repository = new UserRepository();
  }

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
  async login(req, res) {

    //check format email
    if (req.body.email && req.body.email.indexOf('@') !== -1 &&  !ValidationArgenissFormat(req.body.email)) {
      this._error(res, "Failed to login. Email with invalid format");
      return;
    }

    // check if user exist
    const result = await this.repository.findOneToLogin(req.body.email);
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

    const isCorrectPassword = PasswordHasher.validatePassword(req.body.password, user.password)
    if (!isCorrectPassword) {
      this._error(res, "Failed to login. Invalid password!")
      return
    }

    const token = PasswordHasher.generateToken(user);
    const data = { message: "Login correct!", token: token, user: user };
    this._success(res, data);
  };

  /**
   * Refresh auth token
   */
  refreshToken(req, res) {
    var token = req.body.token || req.query.token || req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Invalid Token' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid Token or secret' });
      }
      const data = this.repository.findOne(user._id);
      const token = PasswordHasher.generateToken(data);
      data = {
        message: "Refresh Token OK",
        token: token,
        user: data
      };
      this._success(res, data);
    });
  };

}

module.exports = AuthController;