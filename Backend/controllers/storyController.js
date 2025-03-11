const TravelStory = require("../models/travelStory.model");
const fs = require("fs");
const path = require("path");

// Handle image upload
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: true, message: "No file uploaded" });
    }
    const image = req.file;
    const imageUrl = `http://localhost:3000/uploads/${image.filename}`;

    res.status(201).json({ imageUrl, message: "Image uploaded successfully" });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};

// Delete an image from uploads directory
const deleteImage = async (req, res) => {
  const { imageUrl } = req.query;
  if (!imageUrl) {
    return res.status(400).json({ error: true, message: "ImageUrl parameter is required" });
  }
  try {
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, "../uploads", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "Image deleted successfully" });
    } else {
      res.status(404).json({ error: true, message: "Image not found" });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Add Travel Story
const addTravelStory = async (req, res) => {
  const { title, story, visitedLocations, ImageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  if (!title || !story || !visitedLocations || !ImageUrl || !visitedDate) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }

  const parsedVisitedDate = new Date(parseInt(visitedDate));

  try {
    const travelStory = new TravelStory({
      title,
      story,
      visitedLocations,
      userId,
      ImageUrl,
      visitedDate: parsedVisitedDate,
    });
    await travelStory.save();
    res.status(201).json({ story: travelStory, message: "Travel story added successfully" });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};

// Get all travel stories (fixed to return all stories, not just user's)
const getAllTravelStories = async (req, res) => {
  try {
    const travelStories = await TravelStory.find().sort({ isFavourite: -1 });
    res.status(200).json({ travelStories, message: "Travel stories fetched successfully" });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};

// Edit Travel Story
const editTravelStory = async (req, res) => {
  const { id } = req.params;
  const { title, story, visitedLocations, ImageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  if (!title || !story || !visitedLocations || !ImageUrl || !visitedDate) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }

  const parsedVisitedDate = new Date(parseInt(visitedDate));

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

    if (!travelStory) {
      return res.status(404).json({ error: true, message: "Travel story not found" });
    }
    const placeholderImageUrl = "http://localhost:3000/assets/logo.png";

    travelStory.title = title;
    travelStory.story = story;
    travelStory.visitedLocations = visitedLocations;
    travelStory.ImageUrl = ImageUrl || placeholderImageUrl;
    travelStory.visitedDate = parsedVisitedDate;

    await travelStory.save();
    res.status(201).json({ story: travelStory, message: "Travel story updated successfully" });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};

// Delete Travel Story
const deleteTravelStory = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
    if (!travelStory) {
      return res.status(404).json({ error: true, message: "Travel story not found" });
    }

    const ImageUrl = travelStory.ImageUrl;
    const filename = path.basename(ImageUrl);
    const filePath = path.join(__dirname, "../uploads", filename);

    await travelStory.deleteOne();

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (fileError) {
        console.error("Failed to delete image file:", fileError.message);
      }
    }

    res.status(200).json({ message: "Travel story deleted successfully" });
  } catch (error) {
    console.error("Error deleting travel story:", error.message);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

// Update isFavourite status of a travel story
const updateFavouriteStatus = async (req, res) => {
  const { id } = req.params;
  const { isFavourite } = req.body;
  const { userId } = req.user;

  if (typeof isFavourite !== "boolean") {
    return res.status(400).json({ error: true, message: "isFavourite must be a boolean" });
  }

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
    if (!travelStory) {
      return res.status(404).json({ error: true, message: "Travel story not found" });
    }
    travelStory.isFavourite = isFavourite;
    await travelStory.save();
    res.status(200).json({ message: "Favourite status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Search travel stories
const searchTravelStories = async (req, res) => {
  const { userId } = req.user;
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: true, message: "Search query is required" });
  }

  try {
    const searchResults = await TravelStory.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocations: { $regex: query, $options: "i" } },
      ],
    }).sort({ isFavourite: -1 });

    res.status(200).json({ searchResults, message: "Search results fetched successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Filter travel stories by visited date
const filterTravelStories = async (req, res) => {
  const { startDate, endDate } = req.query;
  const { userId } = req.user;

  try {
    if (!startDate || !endDate || isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({ error: true, message: "Invalid startDate or endDate" });
    }

    const start = new Date(parseInt(startDate));
    const end = new Date(parseInt(endDate));

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: true, message: "Invalid startDate or endDate" });
    }

    if (start > end) {
      return res.status(400).json({ error: true, message: "startDate must be before endDate" });
    }

    console.log("Start Date:", start);
    console.log("End Date:", end);

    const filteredResults = await TravelStory.find({
      userId: userId,
      visitedDate: { $gte: start, $lte: end },
    }).sort({ isFavourite: -1 });

    res.status(200).json({ stories: filteredResults, message: "Travel stories filtered successfully" });
  } catch (error) {
    console.error("Error filtering travel stories:", error.message);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  addTravelStory,
  getAllTravelStories,
  editTravelStory,
  deleteTravelStory,
  updateFavouriteStatus,
  searchTravelStories,
  filterTravelStories,
};