const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../schemas/freelancerSchema");
const Emails = require("../schemas/emailsChema");
const addToUSerCache = require("../methods/addToUserCache").addToUSerCache;
exports.register = (req, res) => {
  const reqBody = req.body;
  const data = { ...reqBody, birthDate: new Date(reqBody.birthDate) };
  const freelancer = new User(data);
  const EmailsData = Emails({ email: reqBody.email });
  EmailsData.save((err, user) => {
    if (err) {
      res.status(400).send({
        message: err,
      });
    } else {
      bcrypt.genSalt(15, (err, salt) => {
        bcrypt.hash(freelancer.password, salt, (err, hash) => {
          freelancer.password = hash;
          freelancer.save(function (err, user) {
            if (err) {
              return res.status(400).send({ message: err });
            } else {
              user.password = undefined;
              return res.send({
                user: user,
                status: 200,
                message: "ADDED",
              });
            }
          });
        });
      });
    }
  });
};

exports.signIn = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      res.status(400).send({
        message: err,
      });
    }
    if (!user || !user.comparePassword(req.body.password)) {
      return res.status(401).send({
        message: "Authentification fails , Invalid Password.",
      });
    }

    const cache = {
      _id: user._id.toString(),
      typeUser: "freelancer",
    };
    addToUSerCache(user._id.toString(), cache);

    res.send({
      token: jwt.sign(
        {
          email: user.email,
          prename: user.name,
          name: user.prename,
          _id: user._id,
        },
        "RESTFULAPIs"
      ),
    });
  });
};

exports.requireLogin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).send({ message: "Unauthorized user!!" });
  }
};

exports.profile = (req, res, next) => {
  if (req.user) {
    res.send(req.user);
    next();
  } else {
    return res.status(401).send({ message: "Invalid token" });
  }
};

exports.testRequiredProfile = (req, res) => {
  res.send({
    message: "User Mawjoud",
  });
};

exports.findAllUser = (req, res) => {
  User.find()
    .then((freelancers) => res.send(freelancers))
    .catch((err) => res.send("Error :" + err));
};

exports.deleteAllFreelancers = (req, res) => {
  User.remove()
    .then((resz) =>
      res.send({
        message: "All Deleted",
      })
    )
    .catch((err) => {
      res.send(err);
    });
};
