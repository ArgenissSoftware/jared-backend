const MongooseRepository = require('./repository');
const UserModel = require('../models/user.model');

class UsersRepository extends MongooseRepository {
  constructor() {
    super(UserModel);
  }

  /**
   * Finds all instances in the model.
   * @param {number} pageNum - amount of records to skip
   * @param {number} batchSize - amount of records to return
   */
  findAll(pageNum, batchSize) {
    const query = super.paginationQueryOptions(pageNum, batchSize);
    return super.findAll('-password', query);
  }

  /**
   * Find user's clients.
   * @param {string} id - User Id
   * @param {number} pageNum - amount of records to skip
   * @param {number} batchSize - amount of records to return
   */
  findUserClients(id, pageNum, batchSize) {
    const query = super.paginationQueryOptions(pageNum, batchSize);
    return this.model.findById(id, 'clients').populate({ path: 'clients', options: query }).lean().exec();
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
}

module.exports = UsersRepository;

