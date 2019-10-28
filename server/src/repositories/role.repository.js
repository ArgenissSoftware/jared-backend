const MongooseRepository = require('./repository');
const RoleModel = require('../models/role.model');

/**
 * Role repository
 */
class RolesRepository extends MongooseRepository {
  /**
   * Constructor
   */
  constructor() {
    super(RoleModel);
  }

  /**
   * Find role by name.
   */
  findOneByName(name) {
    return this.model.findOne({ name: name }).lean().exec();
  }

  /**
   * Find role by name or create a new one
   * @param {string} name
   */
  async findOrCreate(name) {
    let role = await this.model.findOne({ name }).lean().exec();
    if (!role) role = await this.model.create({ name });
    return role;
  }
}

module.exports = RolesRepository;