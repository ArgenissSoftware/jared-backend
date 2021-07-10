import express from "express";
const router = express.Router();

import AuthController from "../controllers/auth.controller";
import ClientsController from "../controllers/clients.controller";
import MeController from "../controllers/me.controller";
import UsersController from "../controllers/users.controller";
import RolesController from "../controllers/roles.controller";
import WorkedHoursController from "../controllers/workedHours.controller";
import MyClientsController from "../controllers/myclients.controller";

new AuthController("/auth", router);
new ClientsController(
  "/clients",
  router,
  new WorkedHoursController("/:client/hours")
);
new MeController("/me", router);
new UsersController("/users", router);
new RolesController("/roles", router);
new MyClientsController("/myclients", router);

export default router;
