const express = require('express');
const ValidationData = require('../helper/validationIncomingData');
const authorize = require('../core/authorize');

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
    this.authorize = authorize;
    this.router = express.Router();
    parentRouter.use(basePath, this.router);
    this.registerGuards();
    this.registerRoutes();
  }

  /**
   * Register authorizations guards
   */
  registerGuards() { }

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
      message: 'Not found'
    }).end();
  }

  /**
   * Send an error response
   * @param {response} res
   */
  _error(res, error, code = 400) {
    console.log(error);
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
    } else {
      this._success(res, data);
    }
  }

  _hasRequiredParams(res, params, data) {
    var errorMessage = ValidationData(params, data);
    if (errorMessage !== '') {
      this._error(res, errorMessage);
      return false;
    }
    return true;
  }

}

module.exports = BaseRestController;