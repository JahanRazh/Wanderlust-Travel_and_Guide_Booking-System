const express = require("express");
const router = express.Router();
const {
    addHotel,
    getAllHotels,
    getHotelById,
    updateHotel,
    deleteHotel
} = require("../../controllers/Admin/hotelController");

// Define hotel routes
router.post("/hotel/add", addHotel);
router.get("/hotel/all", getAllHotels);
router.get("/hotel/get/:id", getHotelById);
router.put("/hotel/update/:id", updateHotel);
router.delete("/hotel/delete/:id", deleteHotel);

module.exports = router;
