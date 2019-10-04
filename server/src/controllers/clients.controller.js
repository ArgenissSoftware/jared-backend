const CrudRestController = require('./crud-rest.controller');
const ClientRepository = require('../repositories/client.repository');
const UserModel = require('../models/user.model');
const ClientModel = require('../models/client.model');

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
   * Register authorizations guards
   */
  registerGuards() {
    // only admins can create new clients
    this.router.post('/', this.authorize('Admin'));
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
   * Delete a developer from a client
   * @param {request} req
   * @param {response} res
   */
  async deleteDeveloper(req, res) {
    ClientModel.findByIdAndUpdate(
      req.params.id, {
        $pull: {
          employees: req.params.devid
        }
      }, {
      new: true
      },
      (error, data) => {
      if(error) {
        this._error(res, error);
      } else {
        this.deleteClient(req.params.id, req.params.devid, res);
      }
    });
  }

   /**
   * Delete a client from a developer
   */
  async deleteClient(clientId, userId, res) {

    UserModel.findByIdAndUpdate(
      userId, {
        $pull: {
          clients: clientId
        }
      }, {
        new: true
      },
      (error, data) => {
        if (error) {
          this._error(res, error);
        } else {
          this._success(res, data);
        }
      });
  }

/**
  * Assign a developer to a client
  * @param {request} req
  * @param {response} res
  */
 async assignDeveloper(req, res) {
    ClientModel.findByIdAndUpdate(
      req.params.id, {
        $push: {
          employees: req.params.devid
        }
      }, {
        new: true
      },
      (error, data) => {
      if (error) {
        this._error(res, error);
      } else {
        this.assignClient(req.params.id, req.params.devid, res);
      }
    });
  }

   /**
   * Assing a client to a developer
   * @param {request} req
   * @param {response} res
   */
  async assignClient(clientId, userId, res) {
    UserModel.findByIdAndUpdate(
      userId, {
        $push: {
          clients: clientId
        }
      }, {
        new: true
      },
      (error, data) => {
        if (error) {
          this._error(res, error);
        } else {
          this._success(res, data);
        }
      });
  }
}

module.exports = ClientsController;
