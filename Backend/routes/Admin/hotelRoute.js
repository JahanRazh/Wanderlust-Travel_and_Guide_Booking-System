const express = require("express");

const {
    addHotel,
    getAllHotels,
    getHotelById,
    updateHotel,
    deleteHotel
} = require("../../controllers/Admin/hotelController");

const Hotel = require("../../models/Admin/hotelModel"); // Make sure to import the Hotel model
const router = express.Router();


router.get("/hotels/count", async (req, res) => {
    try {
        const count = await Hotel.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Define hotel routes
router.post("/hotels", addHotel);
router.get("/hotels", getAllHotels);
router.get("/hotels/:id", getHotelById);
router.put("/hotels/:id", updateHotel);
router.delete("/hotels/:id", deleteHotel);

module.exports = router;
