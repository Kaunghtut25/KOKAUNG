// Insurance Routes for A9 Global
// ==================================

const express = require('express');
const router = express.Router();

const {
  getInsurancePlans,
  getInsurancePlan,
  createInsurancePlan,
  updateInsurancePlan,
  deleteInsurancePlan,
} = require('../controllers/insuranceController');

// GET /api/insurance — paginated list with filters
router.get('/', getInsurancePlans);

// GET /api/insurance/:id — single insurance plan by ID or slug
router.get('/:id', getInsurancePlan);

module.exports = router;
