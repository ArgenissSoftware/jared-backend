var express = require('express');
var router = express.Router();

const AuthController = require('../controllers/auth.controller');
const ClientsController = require('../controllers/clients.controller');
const MeController = require('../controllers/me.controller');
const UsersController = require('../controllers/users.controller');
const RolesController = require('../controllers/roles.controller');
const WorkedHoursController = require('../controllers/workedHours.controller');
<<<<<<< HEAD
=======

>>>>>>> 05d2438da7bb972d1aa367c3789556cf2bde3261

new AuthController('/auth', router);
new ClientsController('/clients', router);
new MeController('/me', router);
new UsersController('/users', router);
new RolesController('/roles', router);
new WorkedHoursController('/workedHours', router);

module.exports = router
