const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require('fs');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadDir = path.join(__dirname, '../../uploads/guides');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Configure file filter
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'profilePic') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Profile picture must be an image!'), false);
        }
    } else if (file.fieldname === 'certificate') {
        if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Certificate must be a PDF or image!'), false);
        }
    } else {
        cb(new Error('Invalid field name!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
});

// Import controller
const guideController = require('../../controllers/Guide/newguideController');

// Routes
router.post('/apply', 
    upload.fields([
        { name: 'profilePic', maxCount: 1 },
        { name: 'certificate', maxCount: 1 }
    ]), 
    guideController.applyAsGuide
);

router.get('/applications', guideController.getAllApplications);
router.get('/applications/:id', guideController.getApplicationById);
router.put('/applications/:id/approve', guideController.approveApplication);
router.put('/applications/:id/reject', guideController.rejectApplication);

module.exports = router;
