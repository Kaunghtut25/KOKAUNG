// Tour Package Routes for A9 Global
// ====================================

const express = require('express');
const router = express.Router();

const {
  getTours,
  getTour,
  getFeaturedTours,
  createTour,
  updateTour,
  deleteTour,
} = require('../controllers/tourController');

// GET /api/tours — paginated list with filters
router.get('/', getTours);

// GET /api/tours/featured — top 6 featured tours
router.get('/featured', getFeaturedTours);

// GET /api/tours/:id — single tour by ID or slug
router.get('/:id', getTour);

module.exports = router;
