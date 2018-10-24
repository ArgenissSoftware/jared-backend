const CrudRestController = require('./crud-rest.controller');
const RoleModel = require('../models/role.model');
const ValidationData = require('../helper/validationIncomingData');
const RolesRepository = require('../repositories/role.repository');
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
    const repo = new RolesRepository();
    repo.findAll((err, data) => {
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

    const repo = new RolesRepository();
    repo.add(req.body, (err, data) => {
      if (!err) {
        data = {
          message: "Role created!",
          role: data
        };
      }
      this._sendResponse(res, err, data);
    });
  }

  /**
   * Get resource
   */
  get(req, res) {
    const repo = new RolesRepository();
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

    var validation = RoleModel.validateUpdate(req.body);
    if (validation.error) {
      this._error(res, validation.error.details, 422);
      return;
    }
    const repo = new RolesRepository();
    repo.update(req.body, (err, data) => {
      var data = { message: 'Role updated!' };
      this._sendResponse(res, err, data);
    });
  }

  /**
   * Delete resource
   */
  delete(req, res) {

  }


  getByRolename(req, res) {
    var fieldToValidate = ["rolename"];
    var errorMessage = ValidationData(fieldToValidate, req.params);
    if (errorMessage !== "") {
      this._error(res, errorMessage);
      return;
    }
    const repo = new RolesRepository();
    repo.findOneByName(req.params.rolename, (err, data) => {
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
    const repo = new RolesRepository();
    repo.disable(req.params.id, (err, data) => {
      data = { message: "Role disabled!" };
      this._sendResponse(res, err, data);
    });
  }
}
module.exports = RolesController;