var express = require('express');
var router = express.Router();

const AuthController = require('../controllers/auth.controller');
const ClientsController = require('../controllers/clients.controller');
const MeController = require('../controllers/me.controller');
const UsersController = require('../controllers/users.controller');


new AuthController('/auth', router);
new ClientsController('/clients', router);
new MeController('/me', router);
new UsersController('/users', router);

module.exports = router
