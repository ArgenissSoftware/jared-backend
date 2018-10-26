/**
 * IRepository implementation for Mongoose
 * @class MongooseRepository
 */
class MongooseRepository {
  constructor(model) {
    if (!model) {
      throw new Error('Mongoose model type cannot be null.');
    }
    this.model = model;
  }

  /**
   * Finds all instances in the model.
   */
  findAll() {
    return this.model.find({ active: true }).exec();
  }

  /**
   * Find an object.
   * @param {string} id - Object Id
   */
  findOne(id) {
    return this.model.findOne({
      _id: id
    }).lean().exec();
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
}

module.exports = MongooseRepository;
