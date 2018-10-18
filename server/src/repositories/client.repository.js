const MongooseRepository = require('./repository');
const ClientModel = require('../models/client.model');

class ClientsRepository extends MongooseRepository {
  constructor() {
    super(ClientModel);
  }
  /**
   * Find client by name.
   * @param {function} cb - callback
   */
  findOneByName(name, cb) {
    return this.collection.findOne({ name: name }).lean().exec((err, res) => {
      cb(err, res);
    });
  }

}

module.exports = ClientsRepository;