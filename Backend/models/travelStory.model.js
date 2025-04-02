const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const travelStorySchema = new Schema({
    title: { type: String, required: true },
    story: { type: String, required: true },
    visitedLocations: { type: [String], default: [] },
    isFavourite: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdOn: { type: Date, default: Date.now },
    ImageUrl: { type: String, required: true },
    visitedDate: { type: Date, required: true },
    favoriteCount: { type: Number, default: 0 },
    favoritedBy: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("TravelStory", travelStorySchema);