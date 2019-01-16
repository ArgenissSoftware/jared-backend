const MongooseRepository = require('./repository');
const ClientModel = require('../models/client.model');

class ClientsRepository extends MongooseRepository {
  constructor() {
    super(ClientModel);
  }

  /**
   * Finds all instances in the model.
   * @param {number} pageNum - amount of records to skip
   * @param {number} batchSize - amount of records to return
   */
  findAll(pageNum, batchSize) {
    const query = super.paginationQueryOptions(pageNum, batchSize);
    return super.findAll('*', query);
  }

  /**
   * Find client by name.
   */
  findOneByName(name) {
    return this.model.findOne({ name: name }).lean().exec();
  }

}

module.exports = ClientsRepository;