const MongooseRepository = require('./repository');
const RoleModel = require('../models/role.model');

class RolesRepository extends MongooseRepository {
  constructor() {
    super(RoleModel);
  }
  
  
  /**
   * Find role by name.
   * @param {function} cb - callback
   */
  findOneByName(name, cb) {
    return this.collection.findOne({ name: name }).lean().exec((err, res) => {
      cb(err, res);
    });
  }

}

module.exports = RolesRepository;