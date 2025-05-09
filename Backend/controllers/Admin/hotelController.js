const Hotel = require("../../models/Admin/hotelModel");
const { cloudinary, deleteImage } = require("../../utils/cloudinary");

// Add a new hotel
const addHotel = async (req, res) => {
    try {
        const { 
            name, 
            email, 
            pno, 
            type, 
            location, 
            no_of_rooms, 
            description,
            price,
            amenities,
            checkIn,
            checkOut
        } = req.body;
        
        // Handle photo uploads
        let photos = [];
        let mainPhoto = null;

        if (req.files && req.files.length > 0) {
            photos = req.files.map(file => ({
                url: file.path || file.secure_url, // Use secure_url if available
                public_id: file.filename || file.public_id
            }));
            
            // Set the first photo as main photo
            mainPhoto = photos[0];
        }

        // Log the photo data for debugging
        console.log('Uploaded files:', req.files);
        console.log('Processed photos:', photos);

        const newHotel = new Hotel({
            name,
            email,
            pno,
            type,
            location,
            no_of_rooms,
            description,
            price,
            amenities: JSON.parse(amenities || '[]'),
            checkIn,
            checkOut,
            photos,
            mainPhoto
        });

        await newHotel.save();
        res.status(201).json({ message: "Hotel Added", hotel: newHotel });
    } catch (err) {
        console.error('Error adding hotel:', err);
        if (err.code === 11000) {
            // Duplicate key error
            const field = Object.keys(err.keyPattern)[0];
            res.status(400).json({ 
                error: `A hotel with this ${field} already exists` 
            });
        } else {
            res.status(500).json({ 
                error: err.message || "Error adding hotel" 
            });
        }
    }
};

// Get all hotels
const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single hotel by ID
const getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ message: "Hotel not found" });
        res.status(200).json(hotel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a hotel by ID
const updateHotel = async (req, res) => {
    try {
        const { name, email, pno, type, location, no_of_rooms, description } = req.body;
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        // Handle new photo uploads
        if (req.files && req.files.length > 0) {
            const newPhotos = req.files.map(file => ({
                url: file.path,
                public_id: file.filename
            }));

            // Add new photos to existing ones
            hotel.photos = [...hotel.photos, ...newPhotos];

            // If no main photo is set, set the first new photo as main
            if (!hotel.mainPhoto) {
                hotel.mainPhoto = newPhotos[0];
            }
        }

        // Update hotel details
        hotel.name = name || hotel.name;
        hotel.email = email || hotel.email;
        hotel.pno = pno || hotel.pno;
        hotel.type = type || hotel.type;
        hotel.location = location || hotel.location;
        hotel.no_of_rooms = no_of_rooms || hotel.no_of_rooms;
        hotel.description = description || hotel.description;

        await hotel.save();
        res.status(200).json({ message: "Hotel updated successfully", hotel });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a hotel by ID
const deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        // Delete all photos from Cloudinary
        const deletePromises = hotel.photos.map(photo => deleteImage(photo.public_id));
        if (hotel.mainPhoto && hotel.mainPhoto.public_id) {
            deletePromises.push(deleteImage(hotel.mainPhoto.public_id));
        }
        
        await Promise.all(deletePromises);
        
        // Delete the hotel from database
        await hotel.deleteOne();
        
        res.status(200).json({ message: "Hotel deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a specific photo from a hotel
const deletePhoto = async (req, res) => {
    try {
        const { hotelId, photoId } = req.params;
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        // Find the photo to delete
        const photoIndex = hotel.photos.findIndex(photo => photo._id.toString() === photoId);
        
        if (photoIndex === -1) {
            return res.status(404).json({ message: "Photo not found" });
        }

        // Delete from Cloudinary
        await deleteImage(hotel.photos[photoIndex].public_id);

        // Remove from photos array
        hotel.photos.splice(photoIndex, 1);

        // If deleted photo was main photo, update main photo
        if (hotel.mainPhoto && hotel.mainPhoto.public_id === hotel.photos[photoIndex].public_id) {
            hotel.mainPhoto = hotel.photos.length > 0 ? hotel.photos[0] : null;
        }

        await hotel.save();
        res.status(200).json({ message: "Photo deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Set main photo
const setMainPhoto = async (req, res) => {
    try {
        const { hotelId, photoId } = req.params;
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        const photo = hotel.photos.find(photo => photo._id.toString() === photoId);
        
        if (!photo) {
            return res.status(404).json({ message: "Photo not found" });
        }

        hotel.mainPhoto = photo;
        await hotel.save();
        
        res.status(200).json({ message: "Main photo updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addHotel,
    getAllHotels,
    getHotelById,
    updateHotel,
    deleteHotel,
    deletePhoto,
    setMainPhoto
};
