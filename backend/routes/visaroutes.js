// Visa Service Routes for A9 Global
// ====================================

const express = require('express');
const router = express.Router();

const {
  getVisas,
  getVisa,
  createVisa,
  updateVisa,
  deleteVisa,
} = require('../controllers/visaController');

// GET /api/visas — paginated list with filters
router.get('/', getVisas);

// GET /api/visas/:id — single visa service by ID or slug
router.get('/:id', getVisa);

module.exports = router;
