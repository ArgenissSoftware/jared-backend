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
    super.registerRoutes();
    this.router.get('/:id/clients', this.getClients.bind(this));
    this.router.get("/username/:username", this.getByname.bind(this));
    this.router.get("/email/:email", this.getByEmail.bind(this));
    this.router.put("/disable/:id", this.disable.bind(this));

  }

  /**
   * List resources
   */
  list(req, res) {
    UserModel.find({ active: true }, '-password', (err, user) => {
      if (err) {
        this._error(res, err.message, 500);
        return
      }

      let response = {
        status: 200,
        data: user ? user : {}
      }

      res.status(200).json(response).end();
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
        active: true
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
    UserModel.findById(req.params.id, (error, client) => {
      if (error) {
        this._error(res, err.message, 500);
        return
      }

      res.status(200).json({
        status: 200,
        errorInfo: "",
        data: client ? client : {}
      }).end();
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

    UserModel.findByIdAndUpdate(id, req.body, (error, user) => {
      if (error) {
        this._error(res, 'Failed to update user.');
        return;
      }

      res.status(200).json({
        status: 200,
        data: {
          message: 'User updated!'
        }
      });
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
    if (!req.params.id) {
      this._error(res, 'id is required', 500);
      return
    }

    UserModel.findById(req.params.id, 'clients', (err, clients) => {
      if (err) {
        this._error(res, err.message);
        return
      }

      let response = {
        status: 200,
        data: clients ? clients.clients : {}
      }
      res.status(200).json(response).end();
    }).populate('clients');
  }

  getByEmail(req, res) {
    var fieldToValidate = ["email"];
    var errorMessage = ValidationData(fieldToValidate, req.params);

    if (errorMessage != "") {
      res.status(500).json({
        status: 500,
        errorInfo: errorMessage,
        data: {}
      }).end();
      return
    }

    UserModel.find({ email: req.params.email }, '-password', (err, user) => {
      let response = {
        status: 200,
        errorInfo: "",
        data: user ? user : {}
      }

      res.status(200).json(response).end();
    });
  }

  getByname(req, res) {
    var fieldToValidate = ["username"];
    var errorMessage = ValidationData(fieldToValidate, req.params);

    if (errorMessage !== "") {
      res.status(500).json({
        status: 500,
        errorInfo: errorMessage,
        data: {}
      }).end();
      return;
    }

    UserModel.findOne({ username: req.params.username }, '-password', (err, user) => {
      if (err) {
        res.status(500).json({
          status: 500,
          errorInfo: errorMessage,
          data: {}
        }).end();
        return;
      }

      let response = {
        status: 200,
        errorInfo: "",
        data: user ? user : {}
      };

      res.status(200).json(response).end();
    });

  }

  disable(req, res) {
    var fieldToValidate = ["id"];
    var errorMessage = ValidationData(fieldToValidate, req.body);

    if (errorMessage != "") {
      res.status(500).json({
        status: 500,
        errorInfo: errorMessage,
        data: {}
      }).end();
      return
    }

    UserModel.findByIdAndUpdate(req.body.id, { active: false }, (error, user) => {
      if (error) {
        this._error(res, "Failed to delete user.")
        return
      }

      res.status(200).json({
        status: 200,
        errorInfo: "",
        data: {
          message: "User disabled!"
        }
      })
    })
  }
}
module.exports = UsersController;