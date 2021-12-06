const userRouter = require("express").Router();
const freelancerController = require("../Controllers/freelancerController");
const JWTController = require("../Controllers/JWTController");

userRouter.route("/auth/register").post(freelancerController.register);
userRouter.route("/auth/signin").post(freelancerController.signIn);
userRouter
  .route("/auth/test")
  .post(
    JWTController.JWTChecker,
    freelancerController.requireLogin,
    freelancerController.testRequiredProfile
  );
userRouter.route("/").get(freelancerController.findAllUser);
userRouter.route("/deleteAll").get(freelancerController.deleteAllFreelancers);

module.exports = userRouter;
