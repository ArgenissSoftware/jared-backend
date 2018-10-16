const CrudRestController = require('./crud-rest.controller');
const RoleModel = require('../models/role.model');
const ValidationData = require('../helper/validationIncomingData');

/**
 * Base Controller
 */
class RolesController extends CrudRestController {

  /**
   * Register controller routes
   */
  registerRoutes() {
    this.router.put("/disable/:id", this.disable.bind(this));
    super.registerRoutes();
  }

  /**
   * List resources
   */
  list(req, res) {
    RoleModel.find({ active: true }, '-password', (err, data) => {
      this._sendResponse(res, err, data)
    });
  }

  /**
   * Create resource
   */
  create(req, res) {
    var validation = RoleModel.validateUpdate(req.body);
    if (validation.error) {
      // validation error
      this._error(res, validation.error.details, 422);
      return;
    }

    // check if role exist
    RoleModel.find({ name: req.body.name }, (err, role) => {
      if (role.length > 0) {
          if (role.length == 1 && role[0].active == false) {
              this._error(res, "Role already exist but is disabled. Please re enabled it.");
          } else {
              this._error(res, "Role already exist!");
          }

          return;
      }

      var newRole = new RoleModel({
        name: req.body.name,
        can: req.body.can,
        active: true
      });

      newRole.save((error, fluffy) => {
        if (error) {
          this._error(res, "Failed to create new role.")
        }

        res.status(200).json({
          status: 200,
          errorInfo: "",
          data: {
            message: "Role created!",
            role: role
          }
        });
      });
    });
  }

  /**
   * Get resource
   */
  get(req, res) {
    RoleModel.findById(req.params.id, (err, data) => {
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

    var validation = RoleModel.validateUpdate(req.body);
    if (validation.error) {
      // validation error
      this._error(res, validation.error.details, 422);
      return;
    }

    RoleModel.findByIdAndUpdate(id, req.body, (err, data) => {

      if (err) {
        this._error(res, 'Failed to update role.');
        return;
      }
      var data = { message: 'Role updated!' };
      this._success(res, data);
    });
  }

  /**
   * Delete resource
   */
  delete(req, res) {

  }

  disable(req, res) {
    var fieldToValidate = ["id"];
    var errorMessage = ValidationData(fieldToValidate, req.params);

    if (errorMessage != "") {
      this._error(res, errorMessage);
      return;
    }

    RoleModel.findByIdAndUpdate(req.params.id, { active: false }, (err, data) => {
      if (err) {
        this._error(res, "Failed to delete role.")
        return
      }
      data = {message: "Role disabled!"};
      this._success(res,data);
    })
  }
}
module.exports = RolesController;