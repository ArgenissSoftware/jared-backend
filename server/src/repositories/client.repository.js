const MongooseRepository = require('./repository');
const ClientModel = require('../models/client.model');

class ClientsRepository extends MongooseRepository {
  constructor() {
    super(ClientModel);
    this.fieldsSearch = ["name", "email"];
  }

    /**
   * Finds all instances in the model.
   * @param {number} pageNum - amount of records to skip
   * @param {number} pageSize - amount of records to return
   * @param {string} search - string to search
   */
  async findAll(pageNum, pageSize, search) {
    const query = super.paginationQueryOptions(pageNum, pageSize);
    if(search != "undefined") {
      const data = [];
      const res =  await super.findAllByField(search, this.fieldsSearch, query);
      const count = res.length;
      data.push({ data: res, count: count });
      return data;
    } else {
      return super.findAll('-password', query);
    }
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