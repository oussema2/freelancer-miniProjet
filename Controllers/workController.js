const Work = require("../schemas/workSchema");
const cache = require("../cache/userCache");
const Freelancer = require("../schemas/freelancerSchema");
const addToUSerCache = require("../methods/addToUserCache").addToUSerCache;
const Employee = require("../schemas/employeeSchema");

exports.addWork = (req, res) => {
  const reqBody = req.body;
  const work = new Work({ ...reqBody, employeeData: req.user });
  work.save((err, work) => {
    if (err) {
      return res.status(400).send({ message: err });
    } else {
      res.status(200).send({
        work: work,
        status: 200,
        message: "WORK ADDED",
      });
    }
  });
};

exports.deleteWork = (req, res) => {
  const id = req.params.id;
  Work.findOneAndDelete({ _id: id }, (err, work) => {
    if (err) {
      res.status(400).send({
        message: err,
      });
    }

    res.status(200).send({
      work: work,
      message: "Work Deleted",
    });
  });
};

exports.updateWork = (req, res) => {
  const work = req.body;
  const id = req.params.id;
  Work.findOneAndUpdate(
    { _id: id },
    work,
    { new: true, returnOriginal: true },
    (err, work) => {
      if (err) {
        res.status(400).send({
          message: err,
        });
      }

      res.status(201).send({ result: work });
    }
  );
};

exports.applyWork = (req, res) => {
  const freelancerID = req.body.freelancerId;
  const workId = req.body.workId;
  console.log(workId, freelancerID);
  Work.findOne({ _id: workId }, (err, work) => {
    if (err) {
      res.status(400).send({
        message: err,
      });
    }
    console.log(work);
    for (let i = 0; i < work.applyers.length; i++) {
      const applyer = work.applyers[i];
      if (applyer === freelancerID) {
        return res
          .status(302)
          .send({ meeasge: "You are already Applyed", status: 302 });
      }
    }
    work.applyers.push(freelancerID);
    work.save((err, workFInal) => {
      if (err) {
        res.status(400).send({
          message: err,
        });
      } else {
        Freelancer.findOne({ _id: freelancerID }, (err, freelancer) => {
          if (err) {
            res.status(400).send({
              message: err,
            });
          }
          freelancer.pending.push(workId);
          freelancer.save((err, freelancer) => {
            if (err) {
              res.status(400).send({
                message: err,
              });
            } else {
              return res.status(200).send({
                message: "freelancer APPlyed with success",
                freelancer: freelancer,
                workFinal: workFInal,
              });
            }
          });
        });
      }
    });
  });
};

exports.acceptFreelancer = (req, res) => {
  const freelancerId = req.body.freelancerID;
  const workId = req.body.workId;
  Work.findOne({ _id: workId }, (err, work) => {
    if (err) {
      res.status(400).send({
        message: err,
      });
    }

    for (let i = 0; i < work.applyers.length; i++) {
      const applyer = work.applyers[i];
      if (applyer === freelancerId) {
        work.acceptedFreelancer = freelancerId;
        work.save((err, work) => {
          if (err) {
            res.status(400).send({
              message: err,
            });
          }
        });
        Freelancer.findOne({ _id: freelancerId }, (err, freelancer) => {
          console.log("freelancer : ", freelancer);
          if (err) {
            res.status(400).send({
              message: err,
            });
          } else {
            freelancer.workHistory.push(workId);
            freelancer.pending = freelancer.pending.filter(
              (item) => item !== workId
            );
            freelancer.save((err, freelancer) => {
              if (err) {
                res.status(400).send({
                  message: err,
                });
              }
              res.send({
                message: "freelancer successfuly accepted for job",
                freelancer: freelancer,
                status: 200,
              });
            });
          }
        });
      }
    }
  });
};

exports.uploadWork = (req, res) => {
  Work.findOne({ _id: req.body.workId }, (err, work) => {
    if (err) {
      res.status(400).send({
        message: err,
      });
    } else {
      work.delivred = true;
      work.save((err, work) => {
        if (err) {
          res.status(400).send({
            message: "error saving work !",
            Error: err,
          });
        }
      });
    }
  });
  res.send(req.file);
};

exports.getAllWork = (req, res) => {
  Work.find((err, works) => {
    if (err) {
      res.status(400).send({
        message: err,
      });
    }
    res.status(200).send({ works: works });
  });
};

exports.testTypeEmployee = (req, res, next) => {
  const user = req.user;

  if (cache[user._id] && cache[user._id].typeUser === "employee") {
    next();
  } else {
    Employee.findOne({ _id: user._id }, (err, userx) => {
      if (err) {
        res.status(400).send({
          message: "Access Denied",
        });
      } else if (!userx) {
        res.status(301).send({
          message: "User Not Found",
        });
      } else {
        addToUSerCache(userx._id, {
          _id: userx._id.toString(),
          typeUser: "employee",
        });

        next();
      }
    });
  }
};
exports.testTypeFreelancer = (req, res, next) => {
  const user = req.user;

  if (cache[user._id] && cache[user._id].typeUser === "employee") {
    next();
  } else {
    Freelancer.findOne({ _id: user._id }, (err, userx) => {
      if (err) {
        res.status(400).send({
          message: "Access Denied",
        });
      } else if (!userx) {
        res.status(301).send({
          message: "User Not Found",
        });
      } else {
        addToUSerCache(userx._id, {
          _id: userx._id.toString(),
          typeUser: "employee",
        });

        next();
      }
    });
  }
};
