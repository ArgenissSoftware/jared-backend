const express = require('express');
const CrudRestController = require('./crud-rest.controller');
const ClientModel = require('../models/client.model');
const ValidationData = require('../helper/validationIncomingData');

class ClientsController extends CrudRestController {

  registerRoutes() {
    super.registerRoutes();
    this.router.get('/byName/:name', this.getByName.bind(this));
  }

  /**
   * List resources
   */
  list(req, res) {
    ClientModel.find({ active: true }, (error, client) => {
      if (error) {
        res.status(500).json({
          status: 500,
          errorInfo: "Failed to get all clients.",
          data: {}
        }).end();
        return
      }

      res.status(200).json({
        status: 200,
        errorInfo: "",
        data: client ? client : {}
      }).end();
  })
  }

  /**
   * Create resource
   */
  create(req, res) {
    
    var validation = ClientModel.validateCreate(req.body);
    if (validation.error) {
      // validation error
      this._error(res, validation.error.details, 422);
      return;
    }

    // check if client exist
    ClientModel.find({ $or: [{ name: req.body.name }] }, (err, client) => {
      if (client.length > 0) {
        this._error(res, "Client already exist!")
        return
      }

      var newClient = new ClientModel({
        name: req.body.name,
        employees: req.body.employees,
        active: true
      });

      newClient.save(function (error, fluffy) {
        if (error) {
          this._error(res, "Failed to create new client.")
        }

        res.status(200).json({
          status: 200,
          errorInfo: "",
          data: {
            message: "Client created!"
          }
        })
      });
    });


  }

  /**
   * Get resource
   */
  get(req, res) {
    var fieldToValidate = ["id"];
    var errorMessage = ValidationData(fieldToValidate, req.params);

    if (errorMessage != ""){
        res.status(500).json({
          status: 500,
          errorInfo: errorMessage,
          data: {}
        })
        return
    }

    ClientModel.findById(req.params.id, (error, client) => {
        if (error){
          res.status(500).json({
            status: 500,
            errorInfo: "Failed to find client.",
            data: {
              message: "Failed to find client."
            }
          })
          return
        }

        res.status(200).json({
          status: 200,
          errorInfo: "",
          data: client ? client : {}
        }).end();

    })
  }

  /**
   * Get resource
   */
  update(req, res) {

    var fieldToValidate = ["id"];
    var errorMessage = ValidationData(fieldToValidate, req.params);
    const id = req.body._id;
    delete req.body._id;
    delete req.body.__v;

    if (errorMessage != "") {
      res.status(500).json({
        status: 500,
        errorInfo: errorMessage,
        data: {}
      }).end();
      return
    }

    var validation = ClientModel.validateUpdate(req.body);
    if (validation.error) {
      // validation error
      this._error(res, validation.error.details, 422);
      return;
    }

    

    ClientModel.findByIdAndUpdate(id, req.body, (error, client) => {
      if (error) {
        res.status(500).json({
          status: 500,
          errorInfo: "Failed to update client.",
          data: {}
        }).end();
        return
      }

      res.status(200).json({
        status: 200,
        errorInfo: "",
        data: {
          message: "Client updated!"
        }
      })
    })

  }

  /**
   * Delete resource
   */
  delete(req, res) {

    var fieldToValidate = ["id"];
    var errorMessage = ValidationData(fieldToValidate, req.params);

    if (errorMessage != "") {
        res.status(500).json({
            status: 500,
            errorInfo: errorMessage,
            data: {}
        }).end();
        return
    }

    ClientModel.findByIdAndUpdate(req.params.id, { active: false }, (error, client) => {
        if (error) {
          res.status(500).json({
              status: 500,
              errorInfo: "Failed to delete client",
              data: {
                message: "Failed to delete client"
              }
          }).end();
          return
        }

        res.status(200).json({
          status: 200,
          errorInfo: "",
          data: {
            message: "Client deleted!"
          }
        }).end();
    })

  }

  getByName(req, res){
    
      var fieldToValidate = ["name"];
    var errorMessage = ValidationData(fieldToValidate, req.query);

    if (errorMessage != ""){
        res.status(500).json({
          status: 500,
          errorInfo: errorMessage,
          data: {}
        })
        return
    }

    clientModel.find({ name: req.query.name }, (error, client) => {
        if (error){
          res.status(500).json({
            status: 500,
            errorInfo: "Failed to find client by name.",
            data: {
              message: "Failed to find client by name."
            }
          })
          return
        }

        res.status(200).json({
          status: 200,
          errorInfo: "",
          data: client ? client : {}
        }).end();

    })

  }

}

module.exports = ClientsController;
