/**
 * IRepository implementation for Mongoose
 * @class MongooseRepository
 */
class MongooseRepository {
  constructor(model) {
    if (!model) {
      throw new Error('Mongoose model type cannot be null.');
    }
    this.collection = model;
  }


  /**
   * Finds all instances in the collection.
   * @param {function} cb - callback
   */
  findAll(cb) {
    return this.collection.find({ active: true }).exec((err, res) => {
      cb(err, res);
    });
  }


  /**
   * Find an object.
   * @param {string} id - Object Id
   * @param {function} cb - callback
   */
  findOne(id, cb) {
    return this.collection.findOne({
      _id: id
    }).lean().exec((err, res) => {
      cb(err, res);
    });
  }

  /**
   * Create an entity.
   * @param {object} entity - Object to create.
   * @param {function} cb - callback
   */
  add(entity, cb) {
    this.collection.create(entity, (err, res) => {
      cb(err, res);
    });
  }

  /**
   * Partially update an object.
   * @param {string} id - Object Id
   * @param {object} obj - Key/Value pairs to update
   * @param {function} cb - callback
   */
  patch(id, obj, cb) {
    return this.collection.findOneAndUpdate({
      _id: id
    }, {
        $set: obj
      }, {
        new: true,
        lean: true
      },
      (err, res) => {
        cb(err, res);
      });
  }

  /**
   * Update an entity.
   * @param {object} entity - Object to update.
   * @param {function} cb - callback
   */
  update(entity, cb) {
    return this.collection.findByIdAndUpdate(entity._id, entity, {
      new: true,
      passRawResult: true,
      lean: true
    }).exec((err, res) => {
      cb(err, res);
    });
  }

  /**
   * Delete an entity.
   * @param {string} id - Entity Id
   * @param {function} cb - callback
   */
  remove(id, cb) {
    return this.collection.findByIdAndRemove(id, (err, res) => {
      cb(err, res);
    });
  }

  /**
   * Disable an entity.
   * @param {string} id - Entity Id
   * @param {function} cb - callback
   */
  disable(id, cb) {
    return this.collection.findByIdAndUpdate(id, { active: false }).exec((err, res) => {
      cb(err, res);
    });
  }
}

module.exports = MongooseRepository;
