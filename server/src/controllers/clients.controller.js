const CrudRestController = require('./crud-rest.controller');
const ValidationData = require('../helper/validationIncomingData');
const ClientRepository = require('../repositories/client.repository');

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

}

module.exports = ClientsController;
