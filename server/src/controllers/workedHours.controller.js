const BaseRestController = require('./base-rest.controller');
const WorkedHoursRepository = require('../repositories/workedHours.repository')

/**
 * Base Controller
 */
class WorkedHoursController extends BaseRestController {

  /**
   * Constructor
   * @param {string} basePath
   * @param {parentRouter} parentRouter
   */
  constructor(basePath, parentRouter) {
    super(basePath, parentRouter);
    this.repository = new WorkedHoursRepository();
  }

  registerRoutes() {
    //this.router.get('/user/:user/client/:client/month/:month', this.getMonthHours.bind(this));
    this.router.get('/client/:client/year/:year/month/:month', this.getMonthHours.bind(this));
    //this.router.post('/user/:user/client/:client/day/:day/hours/:hours', this.setDayHours.bind(this));
    this.router.post('/client/:client/day/:day/hours/:hours', this.setDayHours.bind(this));
  }

  async getMonthHours(req, res) {
    try{ 
      const userId = req.user._id;
      const clientId = req.params.client;
      const year = req.params.year;
      const month = req.params.month;
      const data = await this.repository.findMonthWorkedHours(userId, clientId, month, year);
      this._success(res, data);
    }catch(e) {
      this._error(res, e);
    }
  }

  async setDayHours(req, res) {
    var validation = this.repository.model.validateCreate(req.body);
    if(validation.error) {
      this._error(res, validation.error.details, 422);
      return;
    }
    try {
      const data = await this.repository.addWorkedHours(req.body);
      this._success(res, data);
    }catch(e) {
      this._error(res, e);
    }
  }

} 
module.exports = WorkedHoursController;
