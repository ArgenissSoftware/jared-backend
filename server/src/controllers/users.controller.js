const express = require('express');
const CrudRestController = require('./crud-rest.controller');
const UserModel = require('../models/user.model');

/**
 * Base Controller
 */
class UsersController extends CrudRestController {

  /**
   * Register controller routes
   */
  registerRoutes() {
    super.registerRoutes();
    this.router.get('/:id/clients', this.getClients.bind(this));
  }

  /**
   * List resources
   */
  list(req, res) {
    UserModel.find({ active: true }, '-password', (err, user) =>{
      if(err) {
        this._error(res, err.message, 500);
        return
      }

      let response = {
        status: 200,
        data: user ? user : {}
      }

      res.status(200).json(response).end();
    });
  }

  /**
   * Create resource
   */
  create(req, res) {

  }

  /**
   * Get resource
   */
  get(req, res) {
    UserModel.findById(req.params.id, (error, client) => {
      if (error){
        this._error(res, err.message, 500);
        return
      }

      res.status(200).json({
        status: 200,
        errorInfo: "",
        data: client ? client : {}
      }).end();
    });
  }

  /**
   * Get resource
   */
  update(req, res) {
    const id = req.body._id;
    delete req.body._id;
    delete req.body.__v;

    var validation = UserModel.validateUpdate(req.body);
    if (validation.error) {
      // validation error
      this._error(res, validation.error.details, 422);
      return;
    }

    UserModel.findByIdAndUpdate(id, req.body, (error, user) => {
      if(error){
        this._error(res, 'Failed to update user.');
        return;
      }

      res.status(200).json({
        status: 200,
        data: {
            message: 'User updated!'
        }
      });
    });
  }

  /**
   * Delete resource
   */
  delete(req, res) {

  }

  /**
   * Get user clients
   * @param {request} req
   * @param {response} res
   */
  getClients(req, res) {
    if(!req.params.id) {
      this._error(res, 'id is required', 500);
      return
    }

    UserModel.findById( req.params.id , 'clients', (err, clients) =>{
        if(err) {
          this._error(res, err.message);
          return
        }

        let response = {
            status: 200,
            data: clients ? clients.clients : {}
        }
        res.status(200).json(response).end();
    }).populate('clients');
  }
}

module.exports = UsersController;