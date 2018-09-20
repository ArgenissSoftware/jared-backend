var express = require('express');
var router = express.Router();

const UsersController = require('../controllers/users.controller');

// ROUTES FUNCTIONS
// USER
var createNewUser = require('./user/createUser.route')
var getUserByUsername = require('./user/getUserByUsername.route')
var getUserByEmail = require('./user/getUserByEmail.route')
var updateUser = require('./user/updateUser.route')
var disableUser = require('./user/disableUser.route')
var refreshToken = require('./user/refreshToken.route')

// USERS
var getAllUsers = require('./users/getAllUsers.route')
var getUserClients = require('./users/getUserClients.route')
var updateUserPassword= require('./users/updateUserPassword.route')
var forgotUserPassword= require('./users/forgotUserPassword.route')
var resetUserPassword= require('./users/resetUserPassword.route')

// LOGIN
var doLogin = require('./login/login.route')

// CLIENTS
var createNewClient = require('./clients/createClient.route')
var deleteClient = require('./clients/deleteClient.route')
var getClient = require('./clients/getClient.route')
var updateClient = require('./clients/updateClient.route')
var getAllClients = require('./clients/getAllClients.route')
var getClientByName = require('./clients/getClientByName.route')

// ROUTES
// USER
router.get("/user", getUserByEmail)
router.get("/user/token", refreshToken)
router.get("/user/:username", getUserByUsername)
router.post("/user", createNewUser)
router.put("/user", updateUser)
router.delete("/user", disableUser)

new UsersController('/users', router);

//USERS
// router.get('/users', getAllUsers)
// router.get('/users/:id/clients', getUserClients)
// router.put('/users/:id/update_password', updateUserPassword)
// router.post('/users/forgot_password', forgotUserPassword)
// router.get('/users/reset_password', resetUserPassword)

//CLIENTS
router.post("/clients", createNewClient)
router.delete("/clients/:id", deleteClient)
router.get("/clients/:id", getClient)
router.put("/clients/:id", updateClient)
router.get("/clients", getAllClients)
router.get("/client", getClientByName)

//LOGIN
router.post("/login", doLogin)

module.exports = router
