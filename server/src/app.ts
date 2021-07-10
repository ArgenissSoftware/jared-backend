// var swaggerUi = require('swagger-ui-express'),
//     swaggerDocument = require('./swagger.json');
import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import cors from "cors";

import database from "./database";

import jwt from "express-jwt";

import routes from './routes/routes.config';

// App
const server = express();

// view engine setup
server.engine("html", require("ejs").renderFile);
server.set("view engine", "html");
server.set("view engine", "ejs");

server.use(cors({ credentials: true, origin: true }));

server.set("port", process.env.PORT || 3000);

// format call body
server.use(bodyParser.json({ limit: "1mb" }));
server.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));

// init mongodb
database.initializeMongo();

if (!process.env.JWT_SECRET) {
  console.error(
    "ERROR!: Please set JWT_SECRET before running the app. \n run: export JWT_SECRET=<some secret string> to set JWTSecret. "
  );
  process.exit();
}

server.use(
  jwt({ secret: process.env.JWT_SECRET }).unless({
    path: [
      { url: "/", methods: ["GET"] },
      { url: "/api/auth/login", methods: ["POST"] },
      { url: "/api/auth/register", methods: ["POST"] },
      // { url: '/api/users', methods: ['POST', 'GET']},
      { url: "/api/users/forgot_password", methods: ["POST"] },
      { url: "/api/users/reset_password", methods: ["GET"] },
    ],
  })
);

// TODO: test url then we will remove it
server.get("/", (req, res) => {
  res.send("Ping!\n");
});

// import routes config with all other routes
server.use("/api", routes);

// Adding swagger.
// server.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// expose templates and images as public
server.use(express.static(__dirname + "/public"));

// global error handling
server.use((err: Error, req: Request, res: Response) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ status: 401, error: "invalid token..." });
  }
});

server.listen(server.get("port"), function () {
  console.log("Server is running on port", server.get("port"));
});
