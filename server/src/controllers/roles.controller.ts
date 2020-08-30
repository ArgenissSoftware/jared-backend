import CrudRestController from "./crud-rest.controller";
import RolesRepository from "../repositories/role.repository";
import type { Router, Request, Response } from "express";
import type BaseRestController from "./base-rest.controller";
import { RoleDocument, RoleModel } from "../models/role.model";

/**
 * Role Controller
 */
class RolesController extends CrudRestController<RoleDocument, RoleModel> {
  repository?: RolesRepository;

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
    this.setRepository(new RolesRepository());
  }

  /**
   * Register controller routes
   */
  registerRoutes() {
    this.router.put("/disable/:id", this.disable.bind(this));
    super.registerRoutes();
  }

  /**
   * Disable
   * @param {request} req
   * @param {response} res
   */
  async disable(req: Request, res: Response) {
    try {
      const data = await this.repository.disable(req.params.id);
      this._success(res, data);
    } catch (e) {
      this._error(res, e);
    }
  }
}
export default RolesController;
