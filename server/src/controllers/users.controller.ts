import CrudRestController from "./crud-rest.controller";
import PasswordHasher from "../helper/passwordHasher";
import UserRepository from "../repositories/user.repository";
import RoleRepository from "../repositories/role.repository";
import Model, { UserDocument, UserModel } from "../models/user.model";
import ClientModel from "../models/client.model";
import type { Router, Response, Request } from "express";
import type BaseRestController from "./base-rest.controller";
import RequestWithUser from "../types/requestWithUser";

/**
 * Users Controller
 */
class UsersController extends CrudRestController<UserDocument, UserModel> {
  repository: UserRepository;
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

  registerGuards() {
    // only admins can use all users the endpoints
    this.router.use(/^\/(?!.*\/update_password).*$/, this.authorize('Admin'));
  }

  /**
   * Register controller routes
   */
  registerRoutes() {
    this.router.get("/:id/clients", this.getClients.bind(this));
    this.router.get("/:id/clients/page/:pageNum", this.getClients.bind(this));
    this.router.get("/username/:username", this.getByUsername.bind(this));
    this.router.put("/disable/:id", this.disable.bind(this));
    this.router.delete(
      "/:id/assign/client/:clientid",
      this.deleteClient.bind(this)
    );
    this.router.post(
      "/:id/assign/client/:clientid",
      this.assignClient.bind(this)
    );
    this.router.put("/:id/update_password", this.updatePassword.bind(this));
    super.registerRoutes();
  }

  /**
   * Update user password
   */
  async updatePassword(req: RequestWithUser, res: Response) {
    let errorMessage = "";
    let user;

    //check passwords are equal
    if (req.body.password !== req.body.password_confirmation) {
      errorMessage += "Passwords doesn't match";
    }

    if (errorMessage != "") {
      this._error(res, errorMessage, 400);
      return;
    }

    user = await this.repository.findOne(req.params.id);
    if (!user) return this._error(res, "User don't found.", 400);

    // is his own password?
    if (req.user._id == req.params.id) {
      if (
        !PasswordHasher.validatePassword(req.body.password_old, user.password)
      ) {
        return this._error(res, "Wrong password", 400);
      }
    } else {
      // only admins can changes users passwords
      if (!req.user.roles.some((r) => r === "Admin")) {
        return this._error(res, "You are not allowed", 403);
      }
    }

    user.password = PasswordHasher.hashPassword(req.body.password);

    try {
      await this.repository.update(user as UserDocument);
      res.status(204).end();
    } catch (err) {
      console.log(err);
      this._error(res, "Failed to update user's password.", 400);
    }
  }

  /**
   * Create resource
   */
  async create(req: Request, res: Response) {
    var validation = this.repository.model.validateCreate(req.body);
    if (validation.error) {
      // validation error
      this._error(res, validation.error.details, 422);
      return;
    }

    const rolesRepository = new RoleRepository();
    let userRoles;

    try {
      if (req.body.roles && req.body.roles.length) {
        userRoles = req.body.roles;
      } else {
        userRoles = [await rolesRepository.findOrCreate("Developer")];
      }

      req.body.roles = userRoles;
      req.body.password = PasswordHasher.hashPassword(req.body.password);

      const user = await this.repository.add(req.body);

      const data = {
        message: "User created!",
        user: user,
      };
      this._success(res, data);
    } catch (e) {
      console.error(e);
      this._error(res, e);
    }
  }

  /**
   * Get user clients
   * @param {request} req
   * @param {response} res
   */
  async getClients(req: Request, res: Response) {
    try {
      const pageNum = req.params.pageNum;
      const pageSize = req.params.pageSize;
      const id = req.params.id;
      const data = await this.repository.findUserClients(
        id,
        parseInt(pageNum, 10),
        parseInt(pageSize, 10)
      );
      this._success(res, data);
    } catch (e) {
      this._error(res, e);
    }
  }

  /**
   * Get by name
   * @param {request} req
   * @param {response} res
   */
  async getByUsername(req: Request, res: Response) {
    try {
      const data = await this.repository.findOneByName(req.params.username);
      if (!data) return this._notFound(res);
      this._success(res, data);
    } catch (e) {
      this._error(res, e);
    }
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
   * Delete a client from a developer
   * @param {request} req
   * @param {response} res
   */
  async deleteClient(req: Request, res: Response) {
    Model.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          clients: req.params.clientid,
        },
      },
      {
        new: true,
      },
      (error, data) => {
        if (error) {
          this._error(res, error);
        } else {
          this.deleteDeveloper(req.params.id, req.params.clientid, res);
        }
      }
    );
  }

  /**
   * Delete a developer from a client
   */
  async deleteDeveloper(userId: string, clientId: string, res: Response) {
    ClientModel.findByIdAndUpdate(
      clientId,
      {
        $pull: {
          employees: userId,
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
   * Assign a client to a developer
   * @param {request} req
   * @param {response} res
   */
  async assignClient(req: Request, res: Response) {

    const now = new Date();
    now.setHours(0,0,0);


    try {
      const result = await this.repository.assignClient(
        req.params.id,
        req.params.clientid,
        10, //TODO: should be a param
        now
      );
      this._success(res, result);
    } catch (error) {
      this._error(res, error);
    }
  }

  /**
   * Assign a developer to a client
   */
  async assignDeveloper(userId: string, clientId: string, res: Response) {
    ClientModel.findByIdAndUpdate(
      clientId,
      {
        $push: {
          employees: userId,
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
export default UsersController;
