const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const EmployeeSchema = new Schema({
  cin: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  prename: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  },
  birthDate: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  bankingCarteNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  employeeImage: {
    type: String,
    required: true,
  },

  adress: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  works: [{ type: String, required: true }],
});

EmployeeSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;
