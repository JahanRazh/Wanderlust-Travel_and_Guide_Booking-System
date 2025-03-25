const mongoose = require('mongoose');

// Define schema
const Schema = mongoose.Schema;
const hotelSchema = new Schema({
    name: {
        type: String,
        required: true
        
    },
    email : {
        type: String,
        required: true
    },
    pno: {
        type: Number,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    
    no_of_rooms: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    
});

// Create model
const Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = Hotel;
