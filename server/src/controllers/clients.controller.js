const CrudRestController = require('./crud-rest.controller');
const ClientModel = require('../models/client.model');
const ValidationData = require('../helper/validationIncomingData');

class ClientsController extends CrudRestController {

  registerRoutes() {
    this.router.get("/byName", this.getByName.bind(this));
    super.registerRoutes();
  }

  /**
   * List resources
   */
  list(req, res) {
    ClientModel.find({ active: true }, (error, client) => {

      if (error) {
        this._error(res, "Failed to get all clients.", 500);
        return;
      }
      var data = client ? client : {};
      this._success(res, data);
    })
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

    // check if client exist
    ClientModel.find({ $or: [{ name: req.body.name }] }, (err, client) => {
      if (client.length > 0) {
        this._error(res, "Client already exist!")
        return
      }

      var newClient = new ClientModel({
        name: req.body.name,
        employees: req.body.employees,
        active: true
      });

      newClient.save(function (error, fluffy) {
        if (error) {
          this._error(res, "Failed to create new client.")
        }
        var data = { message: "Client created!" };
        this._success(res, data);
      });
    });
  }

  /**
   * Get resource
   */
  get(req, res) {

    ClientModel.findById(req.params.id, (err, data) => {
      this._sendResponse(res, err, data);
    })
  }

  /**
   * Get resource
   */
  update(req, res) {

   const id = req.body._id;
    delete req.body._id;
    delete req.body.__v;

    var validation = ClientModel.validateUpdate(req.body);
    if (validation.error) {
      // validation error
      this._error(res, validation.error.details, 422);
      return;
    }

    ClientModel.findByIdAndUpdate(id, req.body, (err, data) => {
      var data = { message: "Client updated!" };
      this._sendResponse(res, err, data);
    });

  }

  /**
   * Delete resource
   */
  delete(req, res) {

    ClientModel.findByIdAndUpdate(req.params.id, { active: false }, (err, data) => {
      var data = { message: "Client deleted!" };
      this._sendResponse(res, err, data);
    })
  }

  getByName(req, res) {
    var errorMessage= ValidationData(["name"], req.query);
    if (errorMessage!="") {
      this._error(res, errorMessage);
      return;
    }

    ClientModel.find({ name: req.query.name }, (err, data) => {
      this._sendResponse(res, err, data);
    })

  }

}

module.exports = ClientsController;
