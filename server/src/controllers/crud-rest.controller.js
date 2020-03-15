const BaseRestController = require('./base-rest.controller');

/**
 * Base Controller
 */
class CrudRestController extends BaseRestController {

  /**
   *
   * @param {Repository} repository
   */
  setRepository(repository) {
    this.repository = repository;
  }

  /**
   * Register controller routes
   */
  registerRoutes() {
    this.router.get('/', this.list.bind(this));
    this.router.get('/page/:pageNum/size/:pageSize', this.list.bind(this));
    this.router.post('/', this.create.bind(this));
    this.router.get('/:id', this.get.bind(this));
    this.router.put('/:id', this.update.bind(this));
    this.router.delete('/:id', this.delete.bind(this));
  }

  /**
   * List resources
   */
  async list(req, res) {
    try {
      const pageNum = req.params.pageNum;
      const pageSize = req.params.pageSize;
      const search = req.query.search;
      const data = await this.repository.findAllPaginated(pageNum, pageSize, search);
      this._success(res, data);
    } catch (e) {
      this._error(res, e);
      console.log(e);
    }
  }

  /**
   * Create resource
   */
  async create(req, res) {
    var validation = this.repository.model.validateCreate(req.body);
    if (validation.error) {
      this._error(res, validation.error.details, 422);
      return;
    }
    try {
      const data = await this.repository.add(req.body);
      this._success(res, data);
    } catch (e) {
      this._error(res, e);
    }
  }

  /**
   * Get resource
   */
  async get(req, res) {
    try {
      const data = await this.repository.findOne(req.params.id);
      if (!data) return this._notFound(res);
      this._success(res, data);
    } catch (e) {
      this._error(res, e);
    }
  }

  /**
   * Update resource
   */
  async update(req, res) {
    delete req.body.__v;
    delete req.body.password;

    var validation = this.repository.model.validateUpdate(req.body);
    if (validation.error) {
      this._error(res, validation.error.details, 422);
      return;
    }

    try {
      const data = await this.repository.update(req.body);
      this._success(res, data);
    } catch (e) {
      this._error(res, e);
    }
  }

  /**
   * Delete resource
   */
  async delete(req, res) {
    try {
      const data = await this.repository.remove(req.params.id);
      this._success(res, data);
    } catch (e) {
      this._error(res, e);
    }
  }
}

module.exports = CrudRestController;