const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

var UserSchema = new Schema({
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
    type: Date,
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
  specialitie: {
    type: String,
    required: true,
  },
  skills: {
    type: Array,
    required: true,

    default: [],
  },
  password: {
    type: String,
    required: true,
  },
  freelancerImage: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
    enum: ["Beginner", "Intermediate", "Expert"],
  },
  bio: {
    type: String,
    required: true,
  },
  education: {
    college: { type: String },
    degree: { type: String },
    from: { type: Number },
    to: { type: Number },
  },
  workHistory: [{ type: String, required: true }],
  houreRate: {
    type: Number,
  },
  freelancerRates: [
    { idRater: { type: String, required: true }, rate: { type: Number } },
  ],

  adress: {
    type: String,
    required: true,
  },
  /*   typeUser: {
    type: String,
    enum: ["freelancer", "employee", "admin"],
    required: true,
  }, */
  createdAt: {
    type: Date,
    default: Date.now,
  },
  pending: [{ type: String, required: true }],
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
