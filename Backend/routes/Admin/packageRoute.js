const express = require("express");
const { 
    addPackage, 
    getPackages, 
    getPackageById, 
    updatePackage, 
    deletePackage 
} = require("../../controllers/Admin/packageController");
const Package = require("../../models/Admin/packageModel");
const multer = require("multer");
const path = require("path");

// Configure multer storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/packages');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Configure file filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

// Initialize upload
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max file size
});

const router = express.Router();

// Count route
router.get("/packages/count", async (req, res) => {
    try {
        const count = await Package.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Modified routes to handle file uploads
router.post("/packages", upload.array('images', 5), addPackage);
router.put("/packages/:id", upload.array('images', 5), updatePackage);

// Unchanged routes
router.get("/packages", getPackages);
router.get("/packages/:id", getPackageById);
router.delete("/packages/:id", deletePackage);

module.exports = router;