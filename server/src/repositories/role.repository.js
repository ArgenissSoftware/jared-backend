const MongooseRepository = require('./repository');
const RoleModel = require('../models/role.model');

/**
 * Role repository
 */
class RolesRepository extends MongooseRepository {
  constructor() {
        super(RoleModel);
  }
  
  /**
   * Finds all instances in the model.
   * @param {number} pageNum - amount of records to skip
   * @param {number} pageSize - amount of records to return
   * @param {string} search - string to search
   */
  async findAll(pageNum, pageSize, search) {
    const options = {}
    const query = {active: true};
    super.paginationQueryOptions(pageNum, pageSize, options);
    if (search) super.searchQueryOptions(search, this.fieldsSearch, query);
    return super.findAll('-', query, options);
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