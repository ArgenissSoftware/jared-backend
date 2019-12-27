const CrudRestController = require('./crud-rest.controller');
const UserRepository = require('../repositories/user.repository');

class MyClientsController extends CrudRestController {

   /**
   * Constructor
   * @param {string} basePath
   * @param {parentRouter} parentRouter
   */
  constructor(basePath, parentRouter) {
    super(basePath, parentRouter, new UserRepository());
  }

  registerRoutes() {
    this.router.get('/page/:pageNum/size/:pageSize', this.getMyClients.bind(this));
  }
  
  async getMyClients(req, res) {
    try {
      const pageNum = req.params.pageNum;
      const pageSize = req.params.pageSize;
      const id = req.user._id;
      const search = req.query.search;
      const data = await this.repository.findUserClients(id, pageNum, pageSize, search);
      this._success(res, data);
    } catch (e) {
      this._error(res, e);
    }
  }
}

module.exports = MyClientsController;