import Guide from "../models/Guide.js";
import bcrypt from "bcrypt";

export const registerGuide = async (req, res) => {
  try {
    const { fullname, age, dateOfBirth, gender, contactNumber, email, address, workExperience } = req.body;
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
      workExperience,
      profilePic,
    });

    await newGuide.save();
    res.status(201).json({ message: "Profile Created successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error createring guide", error });
  }
};
