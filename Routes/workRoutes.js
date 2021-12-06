const workRoutes = require("express").Router();

const workController = require("../Controllers/workController");
const JWTController = require("../Controllers/JWTController");
const workUpload = require("../multer/fileUpload").uploadFile;

workRoutes
  .route("/test")
  .get(JWTController.JWTChecker, workController.testTypeEmployee);

workRoutes
  .route("/addWork")
  .post(
    JWTController.JWTChecker,
    workController.testTypeEmployee,
    workController.addWork
  );
workRoutes.route("/").get(workController.getAllWork);
workRoutes.route("/deleteWork/:id").delete(workController.deleteWork);
workRoutes.route("/updateWork/:id").put(workController.updateWork);
workRoutes
  .route("/applyWork")
  .post(
    JWTController.JWTChecker,
    workController.testTypeFreelancer,
    workController.applyWork
  );

workRoutes
  .route("/acceptFreelance")
  .post(
    JWTController.JWTChecker,
    workController.testTypeEmployee,
    workController.acceptFreelancer
  );

workRoutes
  .route("/uploadWork")
  .post(workUpload.single("workFile"), workController.uploadWork);

module.exports = workRoutes;
