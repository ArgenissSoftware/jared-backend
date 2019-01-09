const CrudRestController = require('./crud-rest.controller');
const ValidationData = require('../helper/validationIncomingData');
const ClientRepository = require('../repositories/client.repository');
const UserModel = require('../models/user.model');

/**
 * Clients controllers
 */
class ClientsController extends CrudRestController {

  /**
   * Constructor
   * @param {string} basePath
   * @param {parentRouter} parentRouter
   */
  constructor(basePath, parentRouter) {
    super(basePath, parentRouter, new ClientRepository());
  }

  /**
   * Register controller routes
   */
  registerRoutes() {
    this.router.get("/byname/:name", this.getByName.bind(this));
    this.router.put("/disable/:id", this.disable.bind(this));
    this.router.delete("/:id/assign/developer/:devid", this.deleteDeveloper.bind(this));
    this.router.post("/:id/assign/developer/:devid", this.assignDeveloper.bind(this));
    super.registerRoutes();
  }
 
  /**
   * Disable
   * @param {request} req
   * @param {response} res
   */
  async disable(req, res) {
    try {
      const data = await this.repository.disable(req.params.id);
      this._success(res, data);
    } catch (e) {
      this._error(res, e);
    }
  }

  /**
   * Get by name
   * @param {request} req
   * @param {response} res
   */
  async getByName(req, res) {
    if (!this._hasRequiredParams(res, ["name"], req.params)) return;

    try {
      const data = await this.repository.findOneByName(req.params.name);
      this._success(res, data);
    } catch (e) {
      this._error(res, e);
    }
  }

   /**
   * Delete a developer
   * @param {request} req
   * @param {response} res
   */
  async deleteDeveloper(req, res) {
    console.log("En el deleteDeveloper");
    UserModel.findByIdAndUpdate(req.params.devid, {
      $pull: {
        clients: req.params.id
      }}, {
        new: true
      }, 
      function(error, data) {
      if(error) {
      // this._error(res, error);
      console.log(error);
      }
      console.log("Resultado: "+data);

        // this._success(res, data);
      
    });
  }

   /**
   * Assign a developer
   * @param {request} req
   * @param {response} res
   */
  async assignDeveloper(req, res) {
    console.log("En el assingDeveloper");
    UserModel.findByIdAndUpdate(req.params.devid, {
      $push: {
        clients: req.params.id
      }}, {
        new: true
      },
      function(error, data) {
      if(error) {
      // this._error(res, error);
      console.log(error);
      
      }
      console.log("Resultado: "+data);

    });
  }

}

module.exports = ClientsController;
