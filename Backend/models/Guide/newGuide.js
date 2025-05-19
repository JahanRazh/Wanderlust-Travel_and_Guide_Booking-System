const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const guideApplicationSchema = new Schema({
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
  certificate: { type: String }, // Path to guide certificate file
  isApproved: { type: Boolean, default: false }, // Approval status
  createdAt: { type: Date, default: Date.now }
});

// Using the exact collection name from the database
module.exports = mongoose.model("guideapplications", guideApplicationSchema);
