const CrudRestController = require('./crud-rest.controller');
const UserModel = require('../models/user.model');
const PasswordHasher = require('../helper/passwordHasher');
const ValidationData = require('../helper/validationIncomingData');

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
    UserModel.find({ active: true }, '-password', (err, data) => {
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

    // check if user exist
    UserModel.find({ $or: [{ email: req.body.email }, { username: req.body.username }] }, (err, user) => {
      if (user.length > 0) {
        this._error(res, "User already exist!")
        return
      }

      var hashPassword = PasswordHasher.hashPassword(req.body.password);

      var newUser = new UserModel({
        email: req.body.email,
        username: req.body.username,
        password: hashPassword,
        active: true,
        role: req.body.role
      });

      newUser.save((error, fluffy) => {
        if (error) {
          this._error(res, "Failed to create new user.")
        }

        const token = PasswordHasher.generateToken(newUser);
        res.status(200).json({
          status: 200,
          errorInfo: "",
          data: {
            message: "User created!",
            token: token,
            user: user
          }
        });
      });
    });
  }

  /**
   * Get resource
   */
  get(req, res) {
    UserModel.findById(req.params.id, (err, data) => {
      this._sendResponse(res, err, data);
    });
  }

  /**
   * Get resource
   */
  update(req, res) {
    const id = req.body._id;
    delete req.body._id;
    delete req.body.__v;
    delete req.body.password;

    var validation = UserModel.validateUpdate(req.body);
    if (validation.error) {
      // validation error
      this._error(res, validation.error.details, 422);
      return;
    }

    UserModel.findByIdAndUpdate(id, req.body, (err, data) => {

      if (err) {
        this._error(res, 'Failed to update user.');
        return;
      }
      var data = { message: 'User updated!' };
      this._success(res, data);
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

    UserModel.findById(req.params.id, 'clients', (err, data) => {
      this._sendResponse(res, err, data);
    }).populate('clients');
  }

  getByEmail(req, res) {
    var fieldToValidate = ["email"];
    var errorMessage = ValidationData(fieldToValidate, req.params);

    if (errorMessage != "") {
      this._error(res, errorMessage);
      return;
    }

    UserModel.find({ email: req.params.email }, '-password', (err, data) => {
      this._success(res, data);
    });
  }

  getByUsername(req, res) {
    var fieldToValidate = ["username"];
    var errorMessage = ValidationData(fieldToValidate, req.params);
    if (errorMessage !== "") {
      this._error(res, errorMessage);
      return;
    }

    UserModel.findOne({ username: req.params.username }, '-password', (err, data) => {
      if (err) {
        this._error(res, errorMessage, 500);
        return;
      }
      this._success(res, data);
    });

  }

  disable(req, res) {
    var fieldToValidate = ["id"];
    var errorMessage = ValidationData(fieldToValidate, req.params);

    if (errorMessage != "") {
      this._error(res, errorMessage);
      return;
    }

    UserModel.findByIdAndUpdate(req.params.id, { active: false }, (err, data) => {
      if (err) {
        this._error(res, "Failed to delete user.")
        return
      }
      data = {message: "User disabled!"};
      this._success(res,data);
    })
  }
}
module.exports = UsersController;