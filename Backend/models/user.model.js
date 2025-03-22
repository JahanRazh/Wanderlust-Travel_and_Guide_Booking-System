const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Field to store the user's profile image
    profileImage: { type: String, default: null },
    // Additional fields for user profile
    dateofBirth: { type: Date, default: null },
    gender: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    nic: { type: String, default: null },
    address: { type: String, default: null },
    bio: { type: String, default: null },
    // Additional fields for user preferences related to travel`
    travelstyle: { type: String, default: null },
    travelbudget: { type: String, default: null },
    travelinterest: { type: String, default: null },
    // Fields for password reset
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    // Field to store the date the user account was created
    createdOn: { type: Date, default: Date.now },
    role: { type: String, default: "user" }
});

module.exports = mongoose.model("User", userSchema);