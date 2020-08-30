import jwt from "jsonwebtoken";
import BaseRestController from "./base-rest.controller";
import ValidationArgenissFormat from "../helper/validationArgenissEmail";
import PasswordHasher from "../helper/passwordHasher";
import UserRepository from "../repositories/user.repository";
import { Router, Request, Response } from "express";

/**
 * Auth controller
 */
class AuthController extends BaseRestController {
  repository: any;
  /**
   * Constructor
   * @param {string} basePath
   * @param {parentRouter} parentRouter
   */
  constructor(basePath: string, parentRouter: Router) {
    super(basePath, parentRouter);
    this.repository = new UserRepository();
  }

  /**
   * Register controller routes
   */
  registerRoutes() {
    this.router.post("/login", this.login.bind(this));
    this.router.get("/refreshToken", this.refreshToken.bind(this));
    // this.router.post("/register", this.register.bind(this));
  }

  // /**
  //  * register
  //  */
  // async register(req: Request, res: Response) {
  //   var validation = this.repository.model.validateUpdate(req.body);
  //   if (validation.error) {
  //     // validation error
  //     this._error(res, validation.error.details, 422);
  //     return;
  //   }

  //   const rolesRepository = new RolesRepository();
  //   let userRole;

  //   try {
  //     if (req.body.roles) {
  //       userRole = await rolesRepository.findOne({ _id: req.body.role });
  //       if (!userRole) {
  //         this._error(res, "Role doesn't exists.");
  //         return;
  //       }
  //     } else {
  //       userRole = await rolesRepository.findOrCreate("Developer");
  //     }

  //     req.body.roles = userRole._id;
  //     req.body.password = PasswordHasher.hashPassword(req.body.password);

  //     const user = await this.repository.add(req.body);

  //     const token = PasswordHasher.generateToken(user);
  //     const data = {
  //       message: "User created!",
  //       token: token,
  //       user: user,
  //     };
  //     this._success(res, data);
  //   } catch (e) {
  //     console.error(e);
  //     this._error(res, e);
  //   }
  // }`

  /**
   * Login
   */
  async login(req: Request, res: Response) {
    //check format email
    if (
      req.body.email &&
      req.body.email.indexOf("@") !== -1 &&
      !ValidationArgenissFormat(req.body.email)
    ) {
      this._error(res, "Failed to login. Email with invalid format");
      return;
    }

    // check if user exist
    const user = await this.repository.findOneToLogin(req.body.email);

    if (!user) {
      this._error(res, "Failed to login. User doesn't exist!");
      return;
    }

    if (!user.active) {
      this._error(res, "Failed to login. User disabled");
      return;
    }

    const isCorrectPassword = PasswordHasher.validatePassword(
      req.body.password,
      user.password
    );
    if (!isCorrectPassword) {
      this._error(res, "Failed to login. Invalid password!");
      return;
    }

    const token = PasswordHasher.generateToken(user);
    const data = { message: "Login correct!", token: token, user: user };
    this._success(res, data);
  }

  /**
   * Refresh auth token
   */
  refreshToken(req: Request, res: Response): void {
    var token = req.body.token || req.query.token || req.headers.authorization;
    if (!token) {
      res.status(401).json({ message: "Invalid Token" });
      return;
    }
    jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
      if (err) {
        res.status(401).json({ message: "Invalid Token or secret" });
        return;
      }
      const data = this.repository.findOne(user._id);
      const token = PasswordHasher.generateToken(data);
      const rdata = {
        message: "Refresh Token OK",
        token: token,
        user: data,
      };
      this._success(res, rdata);
    });
  }
}

export default AuthController;
