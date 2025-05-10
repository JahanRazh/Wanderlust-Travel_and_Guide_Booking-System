const Booking = require("../../models/Admin/bookingModel");
const Package = require("../../models/Admin/packageModel");

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      userPhone,
      packageId,
      startDate,
      endDate,
      totalBudget,
      numberOfPeople
    } = req.body;

    // Get package details to include package name
    const packageDetails = await Package.findById(packageId);
    if (!packageDetails) {
      return res.status(404).json({ message: "Package not found" });
    }

    const booking = new Booking({
      userId, // Optional for guest bookings
      userName,
      userEmail,
      userPhone,
      packageId,
      packageName: packageDetails.packageName,
      startDate,
      endDate,
      totalBudget,
      numberOfPeople
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('packageId', 'packageName pricePerPerson images');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get bookings by user ID
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('packageId', 'packageName pricePerPerson images');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('packageId', 'packageName pricePerPerson images');
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email')
     .populate('packageId', 'packageName pricePerPerson images');

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 