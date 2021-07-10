import CrudRestController from "./crud-rest.controller";
import ClientRepository from "../repositories/client.repository";
import UserModel from "../models/user.model";
import Model, { ClientDocument, ClientModel } from "../models/client.model";
import type { Router, Request, Response } from "express";
import type BaseRestController from "./base-rest.controller";

/**
 * Clients controllers
 */
class ClientsController extends CrudRestController<ClientDocument, ClientModel> {
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
    this.setRepository(new ClientRepository());
  }

  /**
   * Register authorizations guards
   */
  registerGuards() {
    // only admins can create new clients
    this.router.post("/", this.authorize("Admin"));
  }

  /**
   * Register controller routes
   */
  registerRoutes() {
    this.router.put("/disable/:id", this.disable.bind(this));
    this.router.delete(
      "/:id/assign/developer/:devid",
      this.deleteDeveloper.bind(this)
    );
    this.router.post(
      "/:id/assign/developer/:devid",
      this.assignDeveloper.bind(this)
    );
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

  /**
   * Delete a developer from a client
   * @param {request} req
   * @param {response} res
   */
  async deleteDeveloper(req: Request, res: Response) {
    Model.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          employees: req.params.devid,
        },
      },
      {
        new: true,
      },
      (error, data) => {
        if (error) {
          this._error(res, error);
        } else {
          this.deleteClient(req.params.id, req.params.devid, res);
        }
      }
    );
  }

  /**
   * Delete a client from a developer
   */
  async deleteClient(clientId: string, userId: string, res: Response) {
    UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: {
          clients: clientId,
        },
      },
      {
        new: true,
      },
      (error, data) => {
        if (error) {
          this._error(res, error);
        } else {
          this._success(res, data);
        }
      }
    );
  }

  /**
   * Assign a developer to a client
   * @param {request} req
   * @param {response} res
   */
  async assignDeveloper(req: Request, res: Response) {
    Model.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          employees: req.params.devid,
        },
      },
      {
        new: true,
      },
      (error, data) => {
        if (error) {
          this._error(res, error);
        } else {
          this.assignClient(req.params.id, req.params.devid, res);
        }
      }
    );
  }

  /**
   * Assing a client to a developer
   * @param {request} req
   * @param {response} res
   */
  async assignClient(clientId: string, userId: string, res: Response) {
    UserModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          clients: clientId,
        },
      },
      {
        new: true,
      },
      (error, data) => {
        if (error) {
          this._error(res, error);
        } else {
          this._success(res, data);
        }
      }
    );
  }
}

export default ClientsController;
