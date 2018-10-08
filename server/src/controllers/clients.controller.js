const CrudRestController = require('./crud-rest.controller');
const ClientModel = require('../models/client.model');
const ValidationData = require('../helper/validationIncomingData');
const ClientRepository = require('../repositories/client.repository');
const repo = new ClientRepository();

class ClientsController extends CrudRestController {

  registerRoutes() {
    this.router.get("/byName", this.getByName.bind(this));
    this.router.put("/disable/:id", this.disable.bind(this));
    super.registerRoutes();
  }

  /**
   * List resources
   */
  list(req, res) {

    repo.findAll((err, data) => {
      this._sendResponse(res, err, data);
    });
  }

  /**
   * Create resource
   */
  create(req, res) {

    var validation = ClientModel.validateCreate(req.body);
    if (validation.error) {
      this._error(res, validation.error.details, 422);
      return;
    }
    repo.add(req.body, (err, data) => {
      var data = { message: "Client created!" };
      this._sendResponse(res, err, data);
    });
  }

  /**
   * Get resource
   */
  get(req, res) {
    repo.findOne(req.params.id, (err, data) => {
      this._sendResponse(res, err, data);
    })
  }

  /**
   * Get resource
   */
  update(req, res) {
    delete req.body.__v;
    var validation = ClientModel.validateUpdate(req.body);
    if (validation.error) {
      // validation error
      this._error(res, validation.error.details, 422);
      return;
    }

    repo.update(req.body, (err, data) => {
      var data = { message: "Client updated!" };
      this._sendResponse(res, err, data);
    });

  }

  /**
   * Delete resource
   */
  delete(req, res) {
    
  }


  disable(req, res) {
    repo.disable(req.params.id, (err, data) => {
      var data = { message: "Client disabled!" };
      this._sendResponse(res, err, data);
    });
  }

  getByName(req, res) {
    var errorMessage = ValidationData(["name"], req.query);
    if (errorMessage != "") {
      this._error(res, errorMessage);
      return;
    }

    repo.findOneByName(req.query.name, (err, data) => {
      this._sendResponse(res, err, data);
    })

  }

}

module.exports = ClientsController;
