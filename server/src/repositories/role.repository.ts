import Repository from "./repository";
import Model, { RoleDocument, RoleModel } from "../models/role.model";

/**
 * Role repository
 */
class RolesRepository extends Repository<RoleDocument, RoleModel> {
  /**
   * Constructor
   */
  constructor() {
    super(Model);
  }

  /**
   * Find role by name.
   */
  findOneByName(name: string) {
    return this.model.findOne({ name: name }).lean().exec();
  }

  /**
   * Find role by name or create a new one
   * @param {string} name
   */
  async findOrCreate(name: string) {
    let role = await this.model.findOne({ name }).lean().exec();
    if (!role) role = await this.model.create({ name });
    return role;
  }
}

export default RolesRepository;
