const express = require("express");
const { 
  getGuides, 
  createGuide, 
  updateGuide, 
  deleteGuide,
  getGuideById 
} = require("../../controllers/Guide/guideController");
const upload = require("../../middleware/upload");

const router = express.Router();

router.get("/getguide", getGuides);
router.get("/guide/:id", getGuideById);
router.post("/createguide", upload.single("profilePic"), createGuide);
router.put("/guideprofile/:id", upload.single("profilePic"), updateGuide);
router.delete("/guide/:id", deleteGuide);

module.exports = router;