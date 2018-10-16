'use strict'
const MongooseRepository = require('./repository');
const UserModel = require('../models/user.model');

class UsersRepository extends MongooseRepository {
  constructor() {
    super(UserModel);
  }

  /**
   * Finds all instances in the collection.
   * @param {function} cb - callback
   */
  findAll(cb) {
    return this.collection.find({ active: true }, '-password').exec((err, res) => {
      cb(err, res);
    });
  }
  /**
  * Find user Clients.
  * used to loqin
  * @param {function} cb - callback
  */
  findUserClients(id, cb) {
    return this.collection.findById(id, 'clients').populate('clients').lean().exec((err, res) => {
      cb(err, res);
    });
  }

  /**
   * Find user by Email.
   * @param {function} cb - callback
   */
  findOneByEmail(email, cb) {
    return this.collection.findOne({ email: email }, '-password').lean().exec((err, res) => {
      cb(err, res);
    });
  }

  /**
   * Find user by username.
   * @param {function} cb - callback
   */
  findOneByName(username, cb) {
    return this.collection.findOne({ username: username }, '-password').lean().exec((err, res) => {
      cb(err, res);
    });
  }

  /**
   * Find user by username or email.
   * used to login
   * @param {function} cb - callback
   */
  findOneToLogin(email, cb) {
    return this.collection.find({ $or: [{ email: email }, { username: email }] }).exec((err, res) => {
      cb(err, res);
    });
  }

  /**
   * Reset user password.
   * @param {function} cb - callback
   */
  resetExpires(email, token, dateExpire, cb) {
    return this.collection.findOneAndUpdate({ email: email }, { reset_password_token: token, reset_password_expires: dateExpire }).exec((err, res) => {
      cb(err, res);
    });
  }


}

module.exports = UsersRepository;

