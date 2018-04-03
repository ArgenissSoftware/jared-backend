var express = require('express')
var router = express.Router()

// ROUTES FUNCTIONS
// USER
var createNewUser = require('./user/createUser.route')
var getUserByUsername = require('./user/getUserByUsername.route')
var getUserByEmail = require('./user/getUserByEmail.route')
var updateUser = require('./user/updateUser.route')
var disableUser = require('./user/disableUser.route')

// USERS
var getAllUsers = require('./users/getAllUsers.route')

// LOGIN
var doLogin = require('./login/login.route')

// CLIENT
var createNewClient = require('./client/createClient.route')
var deleteClient = require('./client/deleteClient.route')
var getClientByName = require('./client/getClientByName.route')
var updateClient = require('./client/updateClient.route')

// CLIENTS
var getAllClients = require('./clients/getAllClients.route')

// ROUTES
// USER
router.get("/user", getUserByEmail)
router.get("/user/:username", getUserByUsername)
router.post("/user", createNewUser)
router.put("/user", updateUser)
router.delete("/user", disableUser)

//USERS
router.get('/users', getAllUsers)

//CLIENT
router.post("/client", createNewClient)
router.delete("/client", deleteClient)
router.get("/client", getClientByName)
router.put("/client", updateClient)

//CLIENTS
router.get("/clients", getAllClients)

//LOGIN
router.post("/login", doLogin)


module.exports = router
