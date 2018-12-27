const CrudRestController = require('./crud-rest.controller');
const PasswordHasher = require('../helper/passwordHasher');
const UserRepository = require('../repositories/user.repository');
const RoleRepository = require('../repositories/role.repository');

/**
 * Base Controller
 */
class UsersController extends CrudRestController {

  /**
   * Constructor
   * @param {string} basePath
   * @param {parentRouter} parentRouter
   */
  constructor(basePath, parentRouter) {
    super(basePath, parentRouter, new UserRepository());
  }

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
   * Get user clients
   * @param {request} req
   * @param {response} res
   */
  async getClients(req, res) {
    try {
      const data = await this.repository.findUserClients(req.params.id);
      this._success(res, data);
    } catch (e) {
      this._error(res, e);
    }
  }

  async getByEmail(req, res) {
    try {
      const data = await this.repository.findOneByEmail(req.params.email);
      if (!data) return this._notFound(res);
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
  async getByUsername(req, res) {
    try {
      const data = await this.repository.findOneByName(req.params.username);
      if (!data) return this._notFound(res);
      this._success(res, data);
    } catch (e) {
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
module.exports = UsersController;