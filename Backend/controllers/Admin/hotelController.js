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

