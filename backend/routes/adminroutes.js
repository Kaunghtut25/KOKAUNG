const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  adminGetDashboard,
  adminGetTours,
  adminGetTour,
  adminCreateTour,
  adminUpdateTour,
  adminDeleteTour,
  adminGetHotels,
  adminCreateHotel,
  adminUpdateHotel,
  adminDeleteHotel,
  adminGetCars,
  adminCreateCar,
  adminUpdateCar,
  adminDeleteCar,
  adminGetVisas,
  adminCreateVisa,
  adminUpdateVisa,
  adminDeleteVisa,
  adminGetInsurancePlans,
  adminCreateInsurancePlan,
  adminUpdateInsurancePlan,
  adminDeleteInsurancePlan,
  adminGetBookings,
  adminUpdateBookingStatus,
  adminGetBookingStats,
} = require('../controllers/adminController');

// All admin routes require authentication + admin role
router.use(protect);
router.use(admin);

// ── Dashboard ──
router.get('/dashboard', adminGetDashboard);

// ── Tours CRUD ──
router.route('/tours')
  .get(adminGetTours)
  .post(adminCreateTour);

router.route('/tours/:id')
  .get(adminGetTour)
  .put(adminUpdateTour)
  .delete(adminDeleteTour);

// ── Hotels CRUD ──
router.route('/hotels')
  .get(adminGetHotels)
  .post(adminCreateHotel);

router.route('/hotels/:id')
  .put(adminUpdateHotel)
  .delete(adminDeleteHotel);

// ── Cars CRUD ──
router.route('/cars')
  .get(adminGetCars)
  .post(adminCreateCar);

router.route('/cars/:id')
  .put(adminUpdateCar)
  .delete(adminDeleteCar);

// ── Visas CRUD ──
router.route('/visas')
  .get(adminGetVisas)
  .post(adminCreateVisa);

router.route('/visas/:id')
  .put(adminUpdateVisa)
  .delete(adminDeleteVisa);

// ── Insurance CRUD ──
router.route('/insurance')
  .get(adminGetInsurancePlans)
  .post(adminCreateInsurancePlan);

router.route('/insurance/:id')
  .put(adminUpdateInsurancePlan)
  .delete(adminDeleteInsurancePlan);

// ── Bookings ──
router.get('/bookings', adminGetBookings);
router.get('/bookings/stats', adminGetBookingStats);
router.put('/bookings/:id', adminUpdateBookingStatus);

module.exports = router;
