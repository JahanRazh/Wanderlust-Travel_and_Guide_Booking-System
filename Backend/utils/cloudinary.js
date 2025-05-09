const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dplnxifrx',
    api_key: '959346423232256',
    api_secret: 'VZ2ic1H1totg4d8IpBCVQyvFV6s'
});

// Configure storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'hotels',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 1000, height: 750, crop: 'limit' }],
        resource_type: 'auto',
        format: 'jpg',
        quality: 'auto',
        fetch_format: 'auto'
    }
});

// Create multer upload instance with error handling
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 10 // Maximum 10 files
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Function to delete image from Cloudinary
const deleteImage = async (public_id) => {
    try {
        const result = await cloudinary.uploader.destroy(public_id);
        console.log('Cloudinary delete result:', result);
        return true;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        return false;
    }
};

module.exports = {
    upload,
    cloudinary,
    deleteImage
}; 