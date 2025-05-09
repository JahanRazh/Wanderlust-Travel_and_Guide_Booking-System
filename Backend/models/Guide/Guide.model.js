// const mongoose = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const guideSchema = new Schema({
  fullname: { type: String, required: true },
  age: { type: Number, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  contactNumber: { type: Number, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  about: { type: String, required: true },
  workExperience: { type: Number, required: true },
  profilePic: { type: String },
});

module.exports  = mongoose.model("Guide", guideSchema);
// const mongoose = require("mongoose");