const CrudRestController = require('./crud-rest.controller');
const PasswordHasher = require('../helper/passwordHasher');
const UserRepository = require('../repositories/user.repository');
const RoleRepository = require('../repositories/role.repository');
const UserModel = require('../models/user.model');
const ClientModel = require('../models/client.model');

/**
 * Base Controller
 */
class UsersController extends CrudRestController {

  /**
   * Constructor
   * @param {string} basePath
   * @param {parentRouter} parentRouter
   */
  constructor(basePath, parentRouter) {
    super(basePath, parentRouter, new UserRepository());
  }

  /**
   * Register controller routes
   */
  registerRoutes() {
    this.router.get('/:id/clients', this.getClients.bind(this));
    this.router.get("/username/:username", this.getByUsername.bind(this));
    this.router.get("/email/:email", this.getByEmail.bind(this));
    this.router.put("/disable/:id", this.disable.bind(this));
    this.router.delete("/:id/assign/client/:clientid", this.deleteClient.bind(this));
    this.router.post("/:id/assign/client/:clientid", this.assignClient.bind(this));
    super.registerRoutes();
  }

  /**
   * Create resource
   */
  async create(req, res) {
    var validation = this.repository.model.validateUpdate(req.body);
    if (validation.error) {
      // validation error
      this._error(res, validation.error.details, 422);
      return;
    }

    const rolesRepository = new RoleRepository();
    let userRole;

    try {
      if (req.body.role) {
        userRole = await rolesRepository.findOne({_id: req.body.role});
        if (!userRole) {
          this._error(res, "Role doesn't exists.")
          return
        }
      } else {
        userRole = await rolesRepository.findOrCreate('Developer');
      }

      req.body.role = userRole._id;
      req.body.password = PasswordHasher.hashPassword(req.body.password);

      const user = await this.repository.add(req.body);

      const data = {
        message: "User created!",
        user: user
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
  async getClients(req, res) {
    try {
      const data = await this.repository.findUserClients(req.params.id);
      this._success(res, data);
    } catch (e) {
      this._error(res, e);
    }
  }

  async getByEmail(req, res) {
    try {
      const data = await this.repository.findOneByEmail(req.params.email);
      if (!data) return this._notFound(res);
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
  async getByUsername(req, res) {
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
  async disable(req, res) {
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
  async deleteClient(req, res) {
    UserModel.findByIdAndUpdate(
      req.params.id, {
        $pull: {
          clients: req.params.clientid
        }
      }, {
        new: true
      },
      (error, data) => {
        if (error) {
          this._error(res, error);
        } else {
          this.deleteDeveloper(req.params.id, req.params.clientid, res)
        }
      });
  }

  /**
   * Delete a developer from a client
   */
  async deleteDeveloper(userId, clientId, res) {
    ClientModel.findByIdAndUpdate(
      clientId, {
        $pull: {
          employees: userId
        }
      }, {
      new: true
      }, 
      (error, data) => {
      if(error) {
        this._error(res, error);
      } else {
        this._success(res, data);
      }
    });
  }

  
  /**
  * Assign a client to a developer
  * @param {request} req
  * @param {response} res
  */
  async assignClient(req, res) {    
    UserModel.findByIdAndUpdate(
      req.params.id, {
        $push: {
          clients: req.params.clientid
        }
      }, {
        new: true
      },
      (error, data) => {
      if (error) {
        this._error(res, error);
      } else {
        this.assignDeveloper(req.params.id, req.params.clientid, res);
      }
    });
  }

  /**
   * Assign a developer to a client
   */
  async assignDeveloper(userId, clientId, res) {    
    ClientModel.findByIdAndUpdate(
      clientId, {
        $push: {
          employees: userId
        }
      }, {
        new: true
      },
      (error, data) => {
        if (error) {
          this._error(res, error);
        } else {
          this._success(res, data);
        }
      });
  }


}
module.exports = UsersController;