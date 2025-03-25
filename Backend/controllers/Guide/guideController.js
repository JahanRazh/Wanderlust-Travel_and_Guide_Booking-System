import Guide from "../models/Guide.js";
import bcrypt from "bcrypt";

export const createGuide = async (req, res) => {
  try {
    const { fullname, age, dateOfBirth, gender, contactNumber, email, address, about, workExperience } = req.body;
    const profilePic = req.file ? req.file.filename : null;

    // Check if email exists
    const existingGuide = await Guide.findOne({ email });
    if (existingGuide) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Save new guide
    const newGuide = new Guide({
      fullname,
      age,
      dateOfBirth,
      gender,
      contactNumber,
      email,
      address,
      about,
      workExperience,
      profilePic,
    });

    await newGuide.save();
    res.status(201).json({ message: "Profile Created successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error createring guide", error });
  }
};

const updateGuide = async (req, res) => {
  try {
      const { fullname, age, dateOfBirth, gender, contactNumber, email, address, about, workExperience, profilePic } = req.body;
      const updatedGuide = await Guide.findByIdAndUpdate(
          req.params.id,
          { fullname, age, dateOfBirth, gender, contactNumber, email, address, about, workExperience, profilePic },
          { new: true }
      );

      if (!updatedGuide) return res.status(404).json({ error: "Guide not found" });

      res.status(200).json({ message: "Guide updated", updatedGuide });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating Guide" });
  }
};


const deleteGuide = async (req, res) => {
  try {
      const deletedGuide = await Guide.findByIdAndDelete(req.params.id);
      if (!deletedGuide) return res.status(404).json({ error: "Guide not found" });

      res.status(200).json({ message: "Guide deleted" });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error deleting Guide" });
  }
};

module.exports = { createGuide, updateGuide, deleteGuide };