import express from "express";
import multer from "multer";
import { registerGuide } from "../controllers/guideController.js";

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/register", upload.single("profilePic"), registerGuide);

export default router;
