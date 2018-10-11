const express = require('express');

/**
 * Base Controller
 */
class BaseRestController {

  /**
   * Constructor
   * @param {string} basePath
   * @param {parentRouter} parentRouter
   */
  constructor(basePath, parentRouter) {
    this.router = express.Router();
    parentRouter.use(basePath, this.router);
    this.registerRoutes();
  }

  /**
   * Register routes
   */
  registerRoutes() { }

  /**
   * Send a standard not found 404
   * @param {response} res
   */
  _notFound(res) {
    res.status(404).json({
      status: 404,
    }).end();
  }

  /**
   * Send an error response
   * @param {response} res
   */
  _error(res, error, code = 400) {
    res.status(code).json({
      status: code,
      errors: error,
    }).end();
  }

  /**
   * Send a success response
   * @param {response} res
   */
  _success(res, data) {
    res.status(200).json({
      status: 200,
      errorInfo: "",
      data: data ? data : {}
    }).end();
  }

  /**
   * Send an success response
   * @param {response} res
   */
  _sendResponse(res, err, data) {
    if (err) {
      this._error(res, err.message, err.status);
      return
    }
    this._success(res, data);
  }

}

module.exports = BaseRestController;