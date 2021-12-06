const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkSchema = new Schema({
  workName: {
    type: String,
    required: true,
    trim: true,
  },
  workDescription: {
    type: String,
    required: true,
    trim: true,
  },
  skillsNeeded: [{ type: String, required: true }],

  paymentMode: {
    type: String,
    enum: ["Fixed Price", "Hourly"],
    required: true,
  },

  hourPrice: {
    type: Number,
  },
  WorkPrice: {
    type: Number,
  },
  freelancerLevel: {
    type: String,
    required: true,
    enum: ["Beginner", "Intermediate", "Expert"],
  },
  applyers: [{ type: String, required: true }],
  employeeData: {
    type: Object,
    required: true,
  },
  acceptedFreelancer: {
    type: String,
    default: "",
  },
  delivred: {
    type: Boolean,
    default: false,
  },
});

WorkSchema.path("hourPrice").required(() => {
  return this.paymentMode === "Hourly";
});

WorkSchema.path("WorkPrice").required(() => {
  return this.paymentMode === "Fixed Price";
});

const Work = mongoose.model("Work", WorkSchema);
module.exports = Work;
