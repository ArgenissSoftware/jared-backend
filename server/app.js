'use strict';

const bodyParser = require('body-parser');
const express = require('express');
var cors = require('cors')
const database = require('./database');
var env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];

// App
const server = express();

// view engine setup
server.engine('html', require('ejs').renderFile);
server.set('view engine', 'html');
server.set('view engine', 'ejs');


server.use(cors({credentials: true, origin: true}))
// Routes
var routes = require('./routes/routes.config');


server.set('port', (process.env.PORT || 3000));

// format call body
server.use(bodyParser.json({limit: '1mb'}));
server.use(bodyParser.urlencoded({limit: '1mb', extended: true}));

// init mongodb
database.initializeMongo();

// TODO: test url then we will remove it
server.get('/', (req, res) => {
  res.send('Hello! Server is working!\n');
});

// import routes config with all other routes
server.use("/api", routes);

//expose templates and images as public
server.use(express.static(__dirname + '/public'));

// init server listen
//server.listen(config.listenPort, config.listenHost, function(error){
//    console.log(`Running on http://${config.listenHost}:${config.listenPort}`);
//});

server.listen(server.get('port'), function() {
  console.log('Server is running on port', server.get('port'));
});
