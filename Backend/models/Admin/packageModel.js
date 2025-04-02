const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    packageName: { type: String, required: true },
    pricePerPerson: { type: Number, required: true },
    hotel: { type: String, required: true },
    guide: { type: String, required: true },
    description: { type: String, required: true },
    climate: { type: String, required: true },
    // Add the image field
    images: [{ type: String }] // Array of image paths
  }
);

const Package = mongoose.model("Package", packageSchema);
module.exports = Package;