const MongooseRepository = require('./repository');
const ClientModel = require('../models/client.model');

class ClientsRepository extends MongooseRepository {
  constructor() {
    super(ClientModel);
  }
  /**
   * Find client by name.
   */
  findOneByName(name) {
    return this.model.findOne({ name: name }).lean().exec();
  }

   /**
   * Find an client with his employees.
   * @param {string} id - Object Id
   */
  findOne(id) {    
    return this.model.findOne({
      _id: id
    }).populate('employees').lean().exec();
  }

}

module.exports = ClientsRepository;