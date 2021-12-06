const employeeRoute = require("express").Router();
const employeeController = require("../Controllers/employeeController");
const JWTController = require("../Controllers/JWTController");

employeeRoute.route("/auth/register").post(employeeController.register);
employeeRoute.route("/auth/signin").post(employeeController.signIn);
employeeRoute
  .route("/auth/test")
  .post(
    JWTController.JWTChecker,
    employeeController.requireLogin,
    employeeController.testRequiredProfile
  );
employeeRoute.route("/").get(employeeController.findAllEmployee);
employeeRoute.route("/deleteAll").get(employeeController.deleteAllEmployee);

module.exports = employeeRoute;
