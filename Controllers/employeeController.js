const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Employee = require("../schemas/employeeSchema");
const Emails = require("../schemas/emailsChema");
const addToUSerCache = require("../methods/addToUserCache").addToUSerCache;

exports.register = (req, res) => {
  const reqBody = req.body;
  const data = { ...reqBody, birthDate: new Date(reqBody.birthDate) };
  const employee = new Employee(data);
  console.log(req.body);

  const EmailsData = Emails({ email: reqBody.email });

  EmailsData.save((err, user) => {
    if (err) {
      res.status(400).send({
        message: err,
      });
    } else {
      bcrypt.genSalt(15, (err, salt) => {
        bcrypt.hash(employee.password, salt, (err, hash) => {
          employee.password = hash;
          employee.save(function (err, employee) {
            if (err) {
              return res.status(400).send({ message: err });
            } else {
              employee.password = undefined;
              res.send({
                employee: employee,
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
  Employee.findOne({ email: req.body.email }, (err, employee) => {
    if (err) throw err;
    if (!employee || !employee.comparePassword(req.body.password)) {
      return res.status(400).send({
        message: "Authentification fails , Invalid Password.",
      });
    }

    const cache = {
      _id: employee._id.toString(),
      typeUser: "employee",
    };
    addToUSerCache(employee._id.toString(), cache);
    res.send({
      token: jwt.sign(
        {
          email: employee.email,
          prename: employee.name,
          name: employee.prename,
          _id: employee._id,
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
    return res.status(400).json({ message: "Unauthorized user!!" });
  }
};

exports.profile = (req, res, next) => {
  if (req.user) {
    res.send(req.user);
    next();
  } else {
    return res.status(400).json({ message: "Invalid token" });
  }
};

exports.testRequiredProfile = (req, res) => {
  res.send({
    message: "User Mawjoud",
  });
};

exports.findAllEmployee = (req, res) => {
  Employee.find()
    .then((freelancers) => res.send(freelancers))
    .catch((err) => res.status(400).send("Error :" + err));
};

exports.deleteAllEmployee = (req, res) => {
  Employee.remove()
    .then((resz) =>
      res.send({
        message: "All Deleted",
      })
    )
    .catch((err) => {
      res.status(400).send(err);
    });
};
