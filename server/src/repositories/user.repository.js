const MongooseRepository = require('./repository');
const UserModel = require('../models/user.model');

class UsersRepository extends MongooseRepository {
  constructor() {
    super(UserModel);
  }

  /**
   * Finds all instances in the model.
   */
  findAll() {
    return this.model.find({ active: true }, '-password').exec();
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
}

module.exports = UsersRepository;

