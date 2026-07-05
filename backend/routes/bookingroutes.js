const express = require('express');
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  processPayment,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All booking routes require authentication
router.use(protect);

// POST /api/bookings — Create a new booking
router.post('/', createBooking);

// GET /api/bookings — Get all bookings for the authenticated user
router.get('/', getMyBookings);

// GET /api/bookings/:id — Get a single booking by ID
router.get('/:id', getBookingById);

// PUT /api/bookings/:id/cancel — Cancel a pending booking
router.put('/:id/cancel', cancelBooking);

// POST /api/bookings/:id/pay — Process payment for a booking
router.post('/:id/pay', processPayment);

module.exports = router;
