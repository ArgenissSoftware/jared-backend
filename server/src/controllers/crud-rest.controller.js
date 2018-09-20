const BaseRestController = require('./base-rest.controller');

/**
 * Base Controller
 */
class CrudRestController extends BaseRestController {

  setModel(model) {
    this.model = model;
  }

  /**
   * Register controller routes
   */
  registerRoutes() {
    this.router.get('/', this.list.bind(this));
    this.router.post('/', this.create.bind(this));
    this.router.get('/:id', this.get.bind(this));
    this.router.put('/:id', this.update.bind(this));
    this.router.delete('/:id', this.delete.bind(this));
  }

  /**
   * List resources
   */
  list(req, res) {
    this._notFound(res);
  }

  /**
   * Create resource
   */
  create(req, res) {
    this._notFound(res);
  }

  /**
   * Get resource
   */
  get(req, res) {
    this._notFound(res);
  }

  /**
   * Get resource
   */
  update(req, res) {
    this._notFound(res);
  }

  /**
   * Delete resource
   */
  delete(req, res) {
    this._notFound(res);
  }
}

module.exports = CrudRestController;