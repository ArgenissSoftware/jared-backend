import { Router, Response } from "express";
import CrudRestController from "./crud-rest.controller";
import UserRepository from "../repositories/user.repository";
import BaseRestController from "./base-rest.controller";
import { UserDocument, UserModel } from "../models/user.model";
import RequestWithUser from "../types/requestWithUser";

/**
 * My clients controller
 */
class MyClientsController extends CrudRestController<UserDocument, UserModel> {
  repository?: UserRepository;
  /**
   * Constructor
   * @param {string} basePath
   * @param {parentRouter} parentRouter
   */
  constructor(
    basePath: string,
    parentRouter: Router,
    ...nestedControllers: Array<BaseRestController>
  ) {
    super(basePath, parentRouter, ...nestedControllers);
    this.setRepository(new UserRepository());
  }
  /**
   * Register routes
   */
  registerRoutes() {
    this.router.get(
      "/page/:pageNum/size/:pageSize",
      this.getMyClients.bind(this)
    );
  }

  /**
   *
   * @param req
   * @param res
   */
  async getMyClients(req: RequestWithUser, res: Response) {
    try {
      const pageNum = req.params.pageNum;
      const pageSize = req.params.pageSize;
      const id = req.user._id;
      const search = req.query.search;
      const data = await this.repository.findUserClients(
        id,
        parseInt(pageNum, 10),
        parseInt(pageSize, 10),
        search as string
      );
      this._success(res, data);
    } catch (e) {
      this._error(res, e);
    }
  }
}

export default MyClientsController;
