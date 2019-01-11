const MongooseRepository = require('./repository');
const UserModel = require('../models/user.model');

class UsersRepository extends MongooseRepository {
  constructor() {
    super(UserModel);
  }

  /**
   * Finds all instances in the model.
   */
  findAll(pageNum, batchSize) {
    let query = {};
    const skip = pageNum ? batchSize * (pageNum - 1) : 0;
    query.skip = skip;
    query.limit = pageNum ? batchSize : 0;
    return this.model.find({ active: true }, '-password', query).exec();
  }

  /**
   * Find user's clients.
   */
  findUserClients(id) {
    return this.model.findById(id, 'clients').populate('clients').lean().exec();
  }

  /**
   * Find user by Email.
   */
  findOneByEmail(email) {
    return this.model.findOne({ email: email }, '-password').lean().exec();
  }

  /**
   * Find user by username.
   */
  findOneByName(username) {
    return this.model.findOne({ username: username }, '-password').lean().exec();
  }

  /**
   * Find user by username or email.
   * used to login
   */
  findOneToLogin(email) {
    return this.model.find({ $or: [{ email: email }, { username: email }] }).exec();
  }

  /**
   * Reset user password.
   */
  resetExpires(email, token, dateExpire) {
    return this.model.findOneAndUpdate(
      { email: email },
      { reset_password_token: token, reset_password_expires: dateExpire }
    ).exec();
  }

 /**
   * Find an user with his clients.
   * @param {string} id - Object Id
   */
  findOne(id) {    
    return this.model.findOne({
      _id: id
    }).populate('clients').lean().exec();
  }
}

module.exports = UsersRepository;

