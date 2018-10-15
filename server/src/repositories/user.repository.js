'use strict'
const MongooseRepository = require('./repository');
const UserModel = require('../models/user.model');
const pg = require('polygoat');

class UsersRepository extends MongooseRepository {
  constructor() {
    super(UserModel);
  }

  findAll(cb) {
    return pg(done => this.collection.find({ active: true }, '-password' ).exec((err, res) => {
      if (err) {
        return done(err);
      }
      return done(null, res);
    }), cb);
  }

  findUserClients(id, cb) {
    const self = this;
    return pg(done => self.collection.findById(
      id, 'clients').populate('clients').lean().exec((err, res) => {
        if (err) {
          return done(err);
        }
        done(null, res);
      }), cb);
  }

  findOneByEmail(email, cb) {
    const self = this;
    return pg(done => self.collection.findOne({ email: email }, '-password').lean().exec((err, res) => {
      if (err) {
        return done(err);
      }
      done(null, res);
    }), cb);
  }

  findOneByName(username, cb) {
    const self = this;
    return pg(done => self.collection.findOne({ username: username }, '-password').lean().exec((err, res) => {
      if (err) {
        return done(err);
      }
      done(null, res);
    }), cb);
  }

  /**
   * Find user by Usename or email.
   * used to loqin
   * @param {function} cb - callback
   * @returns {void}
   */
  findOneToLogin( email ,cb) {
    return pg(done => this.collection.find({ $or: [{ email: email }, { username: email }]},).exec((err, res) => {
      if (err) {
        return done(err);
      }
      return done(null, res);
    }), cb);
  }

  resetExpires( email, token, dateExpire ,cb) {
    return pg(done => this.collection.findOneAndUpdate({ email: email },  { reset_password_token: token, reset_password_expires: dateExpire}).exec((err, res) => {
      if (err) {
        return done(err);
      }
      return done(null, res);
    }), cb);
  }


}

module.exports = UsersRepository;

