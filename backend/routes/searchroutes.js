// Search Routes for A9 Global
// ==============================

const express = require('express');
const router = express.Router();

const {
  searchAll,
  searchTours,
  getSearchSuggestions,
} = require('../controllers/searchController');

// GET /api/search — universal search across tours, hotels, cars
router.get('/', searchAll);

// GET /api/search/tours — specialized tour search with extra filters
router.get('/tours', searchTours);

// GET /api/search/suggestions — autocomplete suggestions
router.get('/suggestions', getSearchSuggestions);

module.exports = router;
