const express = require("express");
const router = express.Router();
const storyController = require("../controllers/storyController");
const { authenticateToken } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Image upload routes
router.post("/image-upload", upload.single("image"), storyController.uploadImage);
router.delete("/delete-image", storyController.deleteImage);

// Travel story routes (all require authentication)
router.post("/add-travel-story", authenticateToken, storyController.addTravelStory);
router.get("/get-all-travel-stories", authenticateToken, storyController.getAllTravelStories);
router.put("/edit-travel-story/:id", authenticateToken, storyController.editTravelStory);
router.delete("/delete-travel-story/:id", authenticateToken, storyController.deleteTravelStory);
router.put("/update-favourite/:id", authenticateToken, storyController.updateFavouriteStatus);
router.get("/search-travel-stories", authenticateToken, storyController.searchTravelStories);
router.get("/filter-travel-stories", authenticateToken, storyController.filterTravelStories);

module.exports = router;