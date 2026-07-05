// Car Rental Routes for A9 Global
// ==================================

const express = require('express');
const router = express.Router();

const {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
} = require('../controllers/carController');

// GET /api/cars — paginated list with filters
router.get('/', getCars);

// GET /api/cars/:id — single car rental by ID or slug
router.get('/:id', getCar);

module.exports = router;
