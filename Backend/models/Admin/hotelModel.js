const mongoose = require('mongoose');

// Define schema
const Schema = mongoose.Schema;
const hotelSchema = new Schema({
    name: {
        type: String,
        required: [true, "Hotel name is required"],
        trim: true,
        // minlength: [3, "Hotel name must be at least 3 characters long"],
        // maxlength: [100, "Hotel name cannot exceed 100 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    pno: {
        type: String, // Changed to String to support leading zeros if needed
        required: [true, "Phone number is required"],
        unique: true,
       match: [/^\d{10}$/, "Phone number must be exactly 10 digits"]
    },
    type: {
        type: String,
        required: [true, "Hotel type is required"],
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        trim: true
    },
    no_of_rooms: {
        type: Number,
        required: [true, "Number of rooms is required"],
        min: [1, "There must be at least one room"],
        max: [1000, "The maximum number of rooms allowed is 1000"]
    },
    price: {
        type: Number,
        required: [true, "Price per night is required"],
        min: [0, "Price cannot be negative"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        minlength: [10, "Description must be at least 10 characters long"],
        maxlength: [500, "Description cannot exceed 500 characters"]
    },
    amenities: [{
        type: String
    }],
    checkIn: {
        type: String,
        required: [true, "Check-in time is required"],
        default: "14:00"
    },
    checkOut: {
        type: String,
        required: [true, "Check-out time is required"],
        default: "12:00"
    },
    photos: [{
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    }],
    mainPhoto: {
        url: {
            type: String,
            default: 'https://via.placeholder.com/300x200?text=Hotel+Image'
        },
        public_id: String
    }
}, {
    timestamps: true
});

// Create model
const Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = Hotel;
