/**
 * IRepository implementation for Mongoose
 * @class MongooseRepository
 */
class MongooseRepository {
  /**
   * Constructor
   * @param {Model} model
   */
  constructor(model) {
    if (!model) {
      throw new Error('Mongoose model type cannot be null.');
    }
    this.model = model;
    this.queryFields = '-';
  }

  /**
   * Finds all instances in the model, with pagination.
   * @param {string} fields - specific fields to be included/excluded
   * @param {object} query - query
   * @param {object} options - options to append to Mongoose's query
   */
  async findAll(fields, query, options) {
    const res = await this.model.find(query, fields, options).exec();
    const count = await this.model.countDocuments(query);
    return { list: res, count: count };
  }

  /**
   * Finds all instances in the model paginated
   * @param {number} pageNum - amount of records to skip
   * @param {number} pageSize - amount of records to return
   * @param {string} search - string to search
   * @param {object} query - string to search
   */
  async findAllPaginated(pageNum, pageSize, search, query = {active: true}) {
    const options = {}
    this.paginationQueryOptions(pageNum, pageSize, options);
    if (search) this.searchQueryOptions(search, this.fieldsSearch, query);
    return this.findAll(this.queryFields, query, options);
  }

  /**
   * Find an object.
   * @param {string} id - Object Id
   */
  findOne(id) {
    return this.model.findOne({
      _id: id
    }, this.queryFields).lean().exec();
  }

  /**
   * Create an entity.
   * @param {object} entity - Object to create.
   */
  add(entity) {
    return this.model.create(entity);
  }

  /**
   * Partially update an object.
   * @param {string} id - Object Id
   * @param {object} obj - Key/Value pairs to update
   */
  patch(id, obj) {
    return this.model.findOneAndUpdate({
      _id: id
    }, {
        $set: obj
      }, {
        new: true,
        lean: true
      });
  }

  /**
   * Update an entity.
   * @param {object} entity - Object to update.
   */
  update(entity) {
    return this.model.findByIdAndUpdate(entity._id, entity, {
      new: true,
      passRawResult: true,
      lean: true
    }).exec();
  }

  /**
   * Delete an entity.
   * @param {string} id - Entity Id
   */
  remove(id) {
    return this.model.findByIdAndRemove(id);
  }

  /**
   * Disable an entity.
   * @param {string} id - Entity Id
   */
  disable(id) {
    return this.model.findByIdAndUpdate(id, { active: false }).exec();
  }

  /**
   * find all the object with string 'search' mateched in the fields 'fieldsSearch'
   * @param {string} fields - specific fields to be included/excluded
   * @param {string} search - Object Id
   * @param {object} fieldsSearch - Key/Value pairs to update
   */
  findAllByField(fields, search, fieldsSearch) {
    let arrayQuery = []
    fieldsSearch.forEach(e => {
      let query = {};
      query[e] = new RegExp(search);
      arrayQuery.push(query);
    });
    return this.findAll(fields, arrayQuery);
  }

  /**
   * Create pagination query.
   * @param {number} pageNum - amount of records to skip
   * @param {number} pageSize - amount of records to return
   * @param {object} options - amount of records to return
   */
  paginationQueryOptions(pageNum, pageSize, options) {
    // if pageNum is null or pageSize == 0, then return ALL records
    options.skip = (pageNum && pageSize > 0) ? pageSize * (pageNum - 1) : 0;
    options.limit = parseInt(((pageNum && pageSize > 0) ? pageSize : 0), 10);
  }

  /**
   * Add search to query
   * @param {string} search
   * @param {array} fieldsSearch
   * @param {object} query
   */
  searchQueryOptions(search, fieldsSearch, query) {
    let arrayQuery = []
    fieldsSearch.forEach(e => {
      let fieldQuery = {};
      fieldQuery[e] = new RegExp(search, 'i');
      arrayQuery.push(fieldQuery);
    });
    query.$or = arrayQuery;
  }
}

module.exports = MongooseRepository;
