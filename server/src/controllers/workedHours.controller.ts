import _ from "lodash";
import BaseRestController from "./base-rest.controller";
import WorkedHoursRepository from "../repositories/workedHours.repository";
import { Router, Response } from "express";
import RequestWithUser from "../types/requestWithUser";

/**
 * Base Controller
 */
class WorkedHoursController extends BaseRestController {
  repository: WorkedHoursRepository;

  /**
   * Constructor
   * @param {string} basePath
   * @param {parentRouter} parentRouter
   */
  constructor(
    basePath: string,
    parentRouter?: Router,
    ...nestedControllers: Array<BaseRestController>
  ) {
    super(basePath, parentRouter, ...nestedControllers);
    this.repository = new WorkedHoursRepository();
  }

  /**
   * Register routes
   */
  registerRoutes() {
    this.router.get("/year/:year/month/:month", this.getMonthHours.bind(this));
    this.router.post("/user/:user", this.setDayHours.bind(this));
    this.router.get(
      "/user/:user/year/:year/month/:month",
      this.getMonthHours.bind(this)
    );
  }

  /**
   * Get month hours
   * @param {Request} req
   * @param {Response} res
   */
  async getMonthHours(req: RequestWithUser, res: Response) {
    try {
      const userId = req.params.user ? req.params.user : req.user._id;
      const clientId = req.params.client;
      const year = req.params.year;
      const month = req.params.month;

      const data = await this.repository.getUserMonthHours(
        userId,
        clientId,
        parseInt(month, 10),
        parseInt(year, 10)
      );

      const result = _.keyBy(data, (k) => k.day.toISOString());

      this._success(res, result);
    } catch (e) {
      this._error(res, e);
    }
  }

  /**
   * Set day hours
   * @param {Request} req
   * @param {Response} res
   */
  async setDayHours(req: RequestWithUser, res: Response) {
    const clientId = req.params.client;
    const userId = req.params.user;
    const record = { clientId, userId, ...req.body };

    // validate data
    const validation = this.repository.model.validateCreate(record);
    if (validation.error) {
      this._error(res, validation.error.details, 422);
      return;
    }

    try {
      const data = await this.repository.set(
        userId,
        clientId,
        req.body.day,
        req.body.hours
      );
      this._success(res, data);
    } catch (e) {
      this._error(res, e);
    }
  }
}
export default WorkedHoursController;
