const CrudRestController = require('./crud-rest.controller');
const UserModel = require('../models/user.model');
const PasswordHasher = require('../helper/passwordHasher');
const ValidationData = require('../helper/validationIncomingData');
const UserRepository = require('../repositories/user.repository');
/**
 * Base Controller
 */
class UsersController extends CrudRestController {

  /**
   * Register controller routes
   */
  registerRoutes() {
    this.router.get('/:id/clients', this.getClients.bind(this));
    this.router.get("/username/:username", this.getByUsername.bind(this));
    this.router.get("/email/:email", this.getByEmail.bind(this));
    this.router.put("/disable/:id", this.disable.bind(this));
    super.registerRoutes();
  }

  /**
   * List resources
   */
  list(req, res) {
    const repo = new UserRepository();
    repo.findAll((err, data) => {
      this._sendResponse(res, err, data)
    });
  }

  /**
   * Create resource
   */
  create(req, res) {
    var validation = UserModel.validateUpdate(req.body);
    if (validation.error) {
      // validation error
      this._error(res, validation.error.details, 422);
      return;
    }

    req.body.password = PasswordHasher.hashPassword(req.body.password);
    const repo = new UserRepository();
    repo.add(req.body, (err, data) => {
      if (!err) {
        const token = PasswordHasher.generateToken(data);
        data = {
          message: "User created!",
          token: token,
          user: data
        };
      }
      this._sendResponse(res, err, data);
    });
  }

  /**
   * Get resource
   */
  get(req, res) {
    const repo = new UserRepository();
    repo.findOne(req.params.id, (err, data) => {
      this._sendResponse(res, err, data);
    });
  }

  /**
   * Get resource
   */
  update(req, res) {
    delete req.body.__v;
    delete req.body.password;

    var validation = UserModel.validateUpdate(req.body);
    if (validation.error) {
      this._error(res, validation.error.details, 422);
      return;
    }
    const repo = new UserRepository();
    repo.update(req.body, (err, data) => {
      var data = { message: 'User updated!' };
      this._sendResponse(res, err, data);
    });
  }

  /**
   * Delete resource
   */
  delete(req, res) {

  }

  /**
   * Get user clients
   * @param {request} req
   * @param {response} res
   */
  getClients(req, res) {
    const repo = new UserRepository();
    repo.findUserClients(req.params.id, (err, data) => {
      this._sendResponse(res, err, data);
    });
  }

  getByEmail(req, res) {
    var fieldToValidate = ["email"];
    var errorMessage = ValidationData(fieldToValidate, req.params);
    if (errorMessage != "") {
      this._error(res, errorMessage);
      return;
    }
    const repo = new UserRepository();
    repo.findOneByEmail(req.params.email, (err, data) => {
      this._sendResponse(res, err, data);
    });
  }

  getByUsername(req, res) {
    var fieldToValidate = ["username"];
    var errorMessage = ValidationData(fieldToValidate, req.params);
    if (errorMessage !== "") {
      this._error(res, errorMessage);
      return;
    }
    const repo = new UserRepository();
    repo.findOneByName(req.params.username, (err, data) => {
      this._sendResponse(res, err, data);
    });

  }

  disable(req, res) {
    var fieldToValidate = ["id"];
    var errorMessage = ValidationData(fieldToValidate, req.params);

    if (errorMessage != "") {
      this._error(res, errorMessage);
      return;
    }
    const repo = new UserRepository();
    repo.disable(req.params.id, (err, data) => {
      data = { message: "User disabled!" };
      this._sendResponse(res, err, data);
    });
  }
}
module.exports = UsersController;