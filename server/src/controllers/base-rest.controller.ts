import express, { Response, RequestHandler } from "express";
import ValidationData from "../helper/validationIncomingData";
import authorize, { RequiredRoles } from "../core/authorize";

import type { Router } from "express";

/**
 * Base Controller
 */
class BaseRestController {
  authorize: (roles: RequiredRoles) => RequestHandler;
  router: Router;
  basePath: string;

  /**
   * Constructor
   * @param {string} basePath
   * @param {Router} parentRouter
   */
  constructor(
    basePath: string,
    parentRouter?: Router,
    ...nestedControllers: Array<BaseRestController>
  ) {
    this.authorize = authorize;
    this.router = express.Router({ mergeParams: true });
    this.basePath = basePath;
    if (parentRouter) {
      this.setParentRoute(parentRouter);
    }

    nestedControllers.forEach((controller) => {
      controller.setParentRoute(this.router);
    });
  }

  /**
   * Set the parent route and register all the routes
   * @param {Router} parentRouter
   */
  setParentRoute(parentRouter: Router) {
    console.log('Set parent', this.basePath, this.router)
    parentRouter.use(this.basePath, this.router);
    this.registerGuards();
    this.registerRoutes();
  }

  /**
   * Register authorizations guards
   */
  registerGuards() {}

  /**
   * Register routes
   */
  registerRoutes() {}

  /**
   * Send a standard not found 404
   * @param {response} res
   */
  _notFound(res: Response) {
    res
      .status(404)
      .json({
        status: 404,
        message: "Not found",
      })
      .end();
  }

  /**
   * Send an error response
   * @param {response} res
   */
  _error(res: Response, error: any, code: number = 400) {
    console.log(error);
    res
      .status(code)
      .json({
        status: code,
        errors: error,
      })
      .end();
  }

  /**
   * Send a success response
   * @param {response} res
   */
  _success(res: Response, data: object) {
    res
      .status(200)
      .json({
        status: 200,
        data: data ? data : {},
      })
      .end();
  }

  /**
   * Send an success response
   * @param {response} res
   */
  _sendResponse(res: Response, err: any, data: object) {
    if (err) {
      this._error(res, err.message, err.status);
    } else {
      this._success(res, data);
    }
  }

  _hasRequiredParams(res: Response, params: object, data: object) {
    var errorMessage = ValidationData(params, data);
    if (errorMessage !== "") {
      this._error(res, errorMessage);
      return false;
    }
    return true;
  }
}

export default BaseRestController;
