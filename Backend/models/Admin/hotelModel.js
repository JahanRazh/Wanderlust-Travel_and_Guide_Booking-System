const mongoose = require('mongoose');

// Define schema
const Schema = mongoose.Schema;
const hotelSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    no_of_rooms: {
        type: Number,
        required: true
    }
});

// Create model
const Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = Hotel;
