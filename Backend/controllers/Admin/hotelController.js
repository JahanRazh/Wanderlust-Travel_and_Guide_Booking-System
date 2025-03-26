const Hotel = require("../../models/Admin/hotelModel");

// Add a new hotel
const addHotel = async (req, res) => {
    try {
        const newHotel = new Hotel(req.body);
        await newHotel.save();
        res.status(201).json({ message: "Hotel Added" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error adding hotel" });
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
        if (!hotel) return res.status(404).json({ message: "hotels not found" });
        res.status(200).json(hotel);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };

// Update a hotel by ID
const updateHotel = async (req, res) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedHotel) return res.status(404).json({ message: "Package not found" });
        res.status(200).json(updatedHotel);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };

// Delete a hotel by ID
const deleteHotel = async (req, res) => {
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!deletedHotel) return res.status(404).json({ message: "Hotel not found" });
        res.status(200).json({ message: "Hotel deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };

module.exports = { addHotel, getAllHotels, getHotelById, updateHotel, deleteHotel };
