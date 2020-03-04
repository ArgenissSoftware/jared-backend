var express = require('express');
var router = express.Router();

const AuthController = require('../controllers/auth.controller');
const ClientsController = require('../controllers/clients.controller');
const MeController = require('../controllers/me.controller');
const UsersController = require('../controllers/users.controller');
const RolesController = require('../controllers/roles.controller');
const WorkedHoursController = require('../controllers/workedHours.controller');
const MyClientsController = require('../controllers/myclients.controller');

new AuthController('/auth', router);
new ClientsController('/clients', router);
new MeController('/me', router);
new UsersController('/users', router);
new RolesController('/roles', router);
new WorkedHoursController('/workedHours', router);
new MyClientsController('/myclients', router);

module.exports = router;
