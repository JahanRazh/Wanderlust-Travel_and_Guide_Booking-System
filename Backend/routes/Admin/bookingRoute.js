const express = require("express");
const {
  createBooking,
  getBookings,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking
} = require("../../controllers/Admin/bookingController");

const router = express.Router();

// Create a new booking
router.post("/bookings", createBooking);

// Get all bookings
router.get("/bookings", getBookings);

// Get bookings by user ID
router.get("/bookings/user/:userId", getUserBookings);

// Get a single booking by ID
router.get("/bookings/:id", getBookingById);

// Update booking status
router.patch("/bookings/:id/status", updateBookingStatus);

// Delete a booking
router.delete("/bookings/:id", deleteBooking);

module.exports = router; 