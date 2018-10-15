'use strict'
const MongooseRepository = require('./repository');
const ClientModel = require('../models/client.model');
const pg = require('polygoat');

class ClientsRepository extends MongooseRepository {
  constructor() {
    super(ClientModel);
  }

  findOneByName(name, cb) {
    const self = this;
    return pg(done => self.collection.findOne({ name: name }).lean().exec((err, res) => {
      if (err) {
        return done(err);
      }
      done(null, res);
    }), cb);
  }

}

module.exports = ClientsRepository;