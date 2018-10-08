'use strict'
const MongooseRepository = require('./repository');
const UserModel = require('../models/user.model');
const pg = require('polygoat');

class UsersRepository extends MongooseRepository {
  constructor() {
   super(UserModel);
  }

  
  getUserClients(id, cb) {
    const self = this;
    return pg(done => self.collection.findById(
    id, 'clients').populate('clients').lean().exec((err, res) => {
      if (err) {
        return done(err);
      }
      done(null, res);
    }), cb);
  }

  getByEmail(email, cb) {
    const self = this;
    return pg(done => self.collection.findOne({ email: email }, '-password').lean().exec((err, res) => {
      if (err) {
        return done(err);
      }
      done(null, res);
    }), cb);
  }

  getByName(username, cb) {
    const self = this;
    return pg(done => self.collection.findOne({ username: username }, '-password').lean().exec((err, res) => {
      if (err) {
        return done(err);
      }
      done(null, res);
    }), cb);
  }

  disable(id, cb) {
    const self = this;
    return pg(done => self.collection.findByIdAndUpdate(id, { active: false }).exec((err, res) => {
      if (err) {
        return done(err);
      }
      done(null, res);
    }), cb);
  }



}




module.exports = UsersRepository;

