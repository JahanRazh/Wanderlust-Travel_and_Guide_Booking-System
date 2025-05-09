const express = require("express");
const {
    addHotel,
    getAllHotels,
    getHotelById,
    updateHotel,
    deleteHotel,
    deletePhoto,
    setMainPhoto
} = require("../../controllers/Admin/hotelController");
const { upload } = require("../../utils/cloudinary");
const Hotel = require("../../models/Admin/hotelModel");
const router = express.Router();

// Get hotel count
router.get("/hotels/count", async (req, res) => {
    try {
        const count = await Hotel.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Define hotel routes
router.post("/hotels", upload.array('photos', 10), addHotel);
router.get("/hotels", getAllHotels);
router.get("/hotels/:id", getHotelById);
router.put("/hotels/:id", upload.array('photos', 10), updateHotel);
router.delete("/hotels/:id", deleteHotel);

// Photo management routes
router.delete("/hotels/:hotelId/photos/:photoId", deletePhoto);
router.put("/hotels/:hotelId/photos/:photoId/main", setMainPhoto);

module.exports = router;
