const express = require("express");
const { 
  getGuides, 
  createGuide, 
  updateGuide, 
  deleteGuide 
} = require("../../controllers/Guide/guideController");
const upload = require("../../middleware/upload");

const router = express.Router();

router.get("/getguide", getGuides);
router.post("/createguide", upload.single("profilePic"), createGuide);
router.put("/guideprofile/:id", upload.single("profilePic"), updateGuide);
router.delete("/guide/:id", deleteGuide);

module.exports = router;