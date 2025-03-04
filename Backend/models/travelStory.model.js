const mongoose = require("mongoose");//importing the mongoose package
const userModel = require("./user.model");
const Schema = mongoose.Schema;//importing the schema from mongoose

const travelStorySchema = new Schema({
    title: { type: String, required: true },
    story: { type: String, required: true },
    visitedLocations: { type: [String], default: [] },
    isFavourite: { type: Boolean, default: false }, // Corrected typo here
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdOn: { type: Date, default: Date.now },
    ImageUrl: { type: String, required: true },
    visitedDate: { type: Date, required: true },
});

module.exports = mongoose.model("TravelStory", travelStorySchema); // Exporting the TravelStory model