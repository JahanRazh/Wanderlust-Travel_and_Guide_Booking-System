const mongoose = require("mongoose");
const config = require("./config.json");

const connectDB = async () => {
  try {
    await mongoose.connect(config.connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;