const CrudRestController = require('./crud-rest.controller');
const RolesRepository = require('../repositories/role.repository');

/**
 * Base Controller
 */
class RolesController extends CrudRestController {

  /**
   * Constructor
   * @param {string} basePath
   * @param {parentRouter} parentRouter
   */
  constructor(basePath, parentRouter) {
    super(basePath, parentRouter, new RolesRepository());
  }

  /**
   * Register controller routes
   */
  registerRoutes() {
    this.router.put("/disable/:id", this.disable.bind(this));
    this.router.get("/byname/:name", this.getByName.bind(this));
    super.registerRoutes();
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
      if (!data) return this._notFound(res);
      this._success(res, data);
    } catch (e) {
      console.log(e);
      this._error(res, e);
    }

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
}
module.exports = RolesController;