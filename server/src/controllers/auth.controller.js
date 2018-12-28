const BaseRestController = require('./base-rest.controller');
const ValidationArgenissFormat = require('../helper/validationArgenissEmail');
const PasswordHasher = require('../helper/passwordHasher');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/user.repository');
const RolesRepository = require('../repositories/role.repository');

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
    this.router.post("/register", this.register.bind(this));
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
   * Create resource
   */
  async register(req, res) {
    var validation = this.repository.model.validateUpdate(req.body);
    if (validation.error) {
      // validation error
      this._error(res, validation.error.details, 422);
      return;
    }

    const rolesRepository = new RolesRepository();
    let userRole;

    try {
      if (req.body.role) {
        userRole = await rolesRepository.findOne({_id: req.body.role});
        if (!userRole) {
          this._error(res, "Role doesn't exists.")
          return
        }
      } else {
        userRole = await rolesRepository.findOrCreate('Developer');
      }

      req.body.role = userRole._id;
      req.body.password = PasswordHasher.hashPassword(req.body.password);

      const user = await this.repository.add(req.body);

      const token = PasswordHasher.generateToken(user);
      const data = {
        message: "User created!",
        token: token,
        user: user
      };
      this._success(res, data);
    } catch (e) {
      console.error(e);
      this._error(res, e);
    }
  }

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