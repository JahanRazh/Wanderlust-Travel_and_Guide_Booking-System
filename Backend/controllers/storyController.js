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
    // Extract the filename from the imageUrl
    const filename = path.basename(imageUrl);
     // Define the file path
    const filePath = path.join(__dirname, "../uploads", filename);
    // Check if the file exists
    if (fs.existsSync(filePath)){
      fs.unlinkSync(filePath);// Delete the file
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
  
  // Validate that all required fields are provided
  if (!title || !story || !visitedLocations || !ImageUrl || !visitedDate) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }
 
  //convert visitedDate from milliseconds to Date object
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

// Get all travel stories
const getAllTravelStories = async (req, res) => {
  const { userId } = req.user;
  try {
    const travelStories = await TravelStory.find({ userId: userId }).sort({ isFavourite: -1 });
    res.status(201).json({ travelStories, message: "Travel stories fetched successfully" });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};

// Edit Travel Story
const editTravelStory = async (req, res) => {
  const { id } = req.params;
  const { title, story, visitedLocations, ImageUrl, visitedDate } = req.body;
  const { userId } = req.user;
  
  // Validate that all required fields are provided
  if (!title || !story || !visitedLocations || !ImageUrl || !visitedDate) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }
  //convert visitedDate from milliseconds to Date object
  const parsedVisitedDate = new Date(parseInt(visitedDate));
  try {
    // Find the travel story by id and userId and ensure it belongs to the authenticated user
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
    // Find the travel story by id and userId and ensure it belongs to the authenticated user
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
    if (!travelStory) {
      return res.status(404).json({ error: true, message: "Travel story not found" });
    }

    // Extract the filename from the imageUrl
    const ImageUrl = travelStory.ImageUrl;
    const filename = path.basename(travelStory.ImageUrl);
    const filePath = path.join(__dirname, "../uploads", filename);

    // Delete the travel story from the database
    await travelStory.deleteOne();

    // Delete the image from the uploads folder/directory
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Send a single response after all operations are completed
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
  try {
    // Find the travel story by id and userId and ensure it belongs to the authenticated user
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
    // Find travel stories that match the search query and belong to the authenticated user
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
    // Validate that startDate and endDate are provided and are valid numbers
    if (!startDate || !endDate || isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({ error: true, message: "Invalid startDate or endDate" });
    }

    // Convert startDate and endDate from milliseconds to Date objects
    const start = new Date(parseInt(startDate));
    const end = new Date(parseInt(endDate));

    // Validate that the dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: true, message: "Invalid startDate or endDate" });
    }

    // Ensure startDate is before endDate
    if (start > end) {
      return res.status(400).json({ error: true, message: "startDate must be before endDate" });
    }

    // Log the dates for debugging purposes
    console.log("Start Date:", start);
    console.log("End Date:", end);

    // Find travel stories that belong to the authenticated user and have visitedDate between startDate and endDate
    const filteredResults = await TravelStory.find({
      userId: userId,
      visitedDate: { $gte: start, $lte: end },
    }).sort({ isFavourite: -1 });

    // Return the filtered results
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
  filterTravelStories
};