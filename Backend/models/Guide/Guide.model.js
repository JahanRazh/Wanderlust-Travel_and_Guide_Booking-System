import mongoose from "mongoose";

const GuideSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  age: { type: Number, required: true, unique: true },
  dateOfBirth: { type: Number, required: true },
  gender: { type: String, required: true },
  contactNumber: { type: Number, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  about: { type: String, required: true },
  workExperience: { type: Number, required: true },
  profilePic: { type: String },
});

const Guide = mongoose.model("Guide", GuideSchema);
export default Guide;
