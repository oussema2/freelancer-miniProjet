const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmailsSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
});

const Emails = mongoose.model("Emails", EmailsSchema);
module.exports = Emails;
