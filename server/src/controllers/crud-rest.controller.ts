import BaseRestController from "./base-rest.controller";
import type Repository from "../repositories/repository";
import { Response, Request } from "express";
import { BaseDocument } from "../models/base.document";
import { BaseModel } from "../models/base.model";
/**
 * Base Controller
 */
class CrudRestController<D extends BaseDocument, M extends BaseModel<D>> extends BaseRestController {
  repository?: Repository<D, M>;

  /**
   *
   * @param {Repository} repository
   */
  setRepository(repository: Repository<D, M>) {
    this.repository = repository;
  }

  /**
   * Register controller routes
   */
  registerRoutes() {
    this.router.get("/", this.list.bind(this));
    this.router.get("/page/:pageNum/size/:pageSize", this.list.bind(this));
    this.router.post("/", this.create.bind(this));
    this.router.get("/:id", this.get.bind(this));
    this.router.put("/:id", this.update.bind(this));
    this.router.delete("/:id", this.delete.bind(this));
  }

  /**
   * List resources
   */
  async list(req: Request, res: Response) {
    try {
      const pageNum = req.params.pageNum;
      const pageSize = req.params.pageSize;
      const search = req.query.search as string;
      const data = await this.repository.findAllPaginated(
        parseInt(pageNum),
        parseInt(pageSize),
        search
      );
      this._success(res, data);
    } catch (e) {
      this._error(res, e);
      console.log(e);
    }
  }

  /**
   * Create resource
   */
  async create(req: Request, res: Response) {
    var validation = this.repository.model.validateCreate(req.body);
    if (validation.error) {
      this._error(res, validation.error.details, 422);
      return;
    }
    try {
      const data = await this.repository.add(req.body);
      this._success(res, data);
    } catch (e) {
      this._error(res, e);
    }
  }

  /**
   * Get resource
   */
  async get(req: Request, res: Response) {
    try {
      const data = await this.repository.findOne(req.params.id);
      if (!data) return this._notFound(res);
      this._success(res, data);
    } catch (e) {
      this._error(res, e);
    }
  }

  /**
   * Update resource
   */
  async update(req: Request, res: Response) {
    delete req.body.__v;
    delete req.body.password;

    var validation = this.repository.model.validateUpdate(req.body);
    if (validation.error) {
      this._error(res, validation.error.details, 422);
      return;
    }

    try {
      const data = await this.repository.update(req.body);
      this._success(res, data);
    } catch (e) {
      this._error(res, e);
    }
  }

  /**
   * Delete resource
   */
  async delete(req: Request, res: Response) {
    try {
      const data = await this.repository.remove(req.params.id);
      this._success(res, data);
    } catch (e) {
      this._error(res, e);
    }
  }
}

export default CrudRestController;
