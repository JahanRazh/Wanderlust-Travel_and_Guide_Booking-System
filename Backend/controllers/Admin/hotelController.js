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

