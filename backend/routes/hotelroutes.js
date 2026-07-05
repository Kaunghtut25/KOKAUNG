// Hotel Routes for A9 Global
// ==============================

const express = require('express');
const router = express.Router();

const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
} = require('../controllers/hotelController');

// GET /api/hotels — paginated list with filters
router.get('/', getHotels);

// GET /api/hotels/:id — single hotel by ID or slug
router.get('/:id', getHotel);

module.exports = router;
