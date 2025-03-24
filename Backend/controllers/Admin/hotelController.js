const Hotel = require("../../models/Admin/hotelModel");

// Add a new hotel
const addHotel = async (req, res) => {
    try {
        const { name, type, location, price, no_of_rooms } = req.body;
        const newHotel = new Hotel({ name, type, location, price, no_of_rooms });

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
        res.status(200).json({ success: true, hotels });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching hotels" });
    }
};

// Get a single hotel by ID
const getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ error: "Hotel not found" });

        res.status(200).json({ success: true, hotel });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching hotel" });
    }
};

// Update a hotel by ID
const updateHotel = async (req, res) => {
    try {
        const { name, type, location, price, no_of_rooms } = req.body;
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { name, type, location, price, no_of_rooms },
            { new: true }
        );

        if (!updatedHotel) return res.status(404).json({ error: "Hotel not found" });

        res.status(200).json({ message: "Hotel updated", updatedHotel });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error updating hotel" });
    }
};

// Delete a hotel by ID
