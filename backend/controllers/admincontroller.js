const TourPackage = require('../models/tourpackage');
const Hotel = require('../models/hotel');
const CarRental = require('../models/carrental');
const VisaService = require('../models/visaservice');
const TravelInsurance = require('../models/travelinsurance');
const Booking = require('../models/booking');
const User = require('../models/user');

const getItemModel = (itemType) => {
  const models = { TourPackage, Hotel, CarRental, VisaService, TravelInsurance };
  return models[itemType] || null;
};

// ──────────────────────────────────────────────
//  DASHBOARD
// ──────────────────────────────────────────────

exports.adminGetDashboard = async (req, res) => {
  try {
    const [
      totalTours,
      totalHotels,
      totalCars,
      totalVisas,
      totalBookings,
      revenueResult,
      pendingCount,
      paidCount,
      cancelledCount,
      completedCount,
    ] = await Promise.all([
      TourPackage.countDocuments(),
      Hotel.countDocuments(),
      CarRental.countDocuments(),
      VisaService.countDocuments(),
      Booking.countDocuments(),
      Booking.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Booking.countDocuments({ paymentStatus: 'pending' }),
      Booking.countDocuments({ paymentStatus: 'paid' }),
      Booking.countDocuments({ bookingStatus: 'cancelled' }),
      Booking.countDocuments({ bookingStatus: 'completed' }),
    ]);

    // Get recent bookings with manual populate
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email phone')
      .populate('item', 'name title price images description')
      .exec();

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        totalTours,
        totalHotels,
        totalCars,
        totalVisas,
        totalBookings,
        totalRevenue,
        recentBookings,
        bookingsByStatus: {
          pending: pendingCount,
          paid: paidCount,
          cancelled: cancelledCount,
          completed: completedCount,
        },
      },
    });
  } catch (err) {
    console.error('adminGetDashboard error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching dashboard data' });
  }
};

// ──────────────────────────────────────────────
//  BOOKING MANAGEMENT
// ──────────────────────────────────────────────

exports.adminGetBookings = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
    if (req.query.bookingStatus) filter.bookingStatus = req.query.bookingStatus;
    if (req.query.itemType) filter.itemType = req.query.itemType;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email phone')
        .populate('item', 'name title price images description')
        .exec(),
      Booking.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('adminGetBookings error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching bookings' });
  }
};

exports.adminUpdateBookingStatus = async (req, res) => {
  try {
    const { bookingStatus } = req.body;

    if (!bookingStatus || !['confirmed', 'cancelled', 'completed'].includes(bookingStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status. Must be: confirmed, cancelled, or completed',
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { bookingStatus },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Manually populate user and item
    if (booking.user) {
      const u = await User.findById(booking.user);
      if (u) booking.user = u;
    }
    if (booking.item && booking.itemModel) {
      const ItemModel = getItemModel(booking.itemModel);
      if (ItemModel) {
        const i = await ItemModel.findById(booking.item);
        if (i) booking.item = i;
      }
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.error('adminUpdateBookingStatus error:', err);
    res.status(500).json({ success: false, message: 'Server error updating booking status' });
  }
};

exports.adminGetBookingStats = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const stats = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo.toISOString() },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Fill in missing months with zero counts
    const result = [];
    const labels = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const key = `${year}-${String(month).padStart(2, '0')}`;
      const match = stats.find((s) => s._id.year === year && s._id.month === month);
      labels.push(key);
      result.push({
        month: key,
        count: match ? match.count : 0,
        revenue: match ? match.revenue : 0,
      });
    }

    res.status(200).json({
      success: true,
      data: result,
      labels,
    });
  } catch (err) {
    console.error('adminGetBookingStats error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching booking stats' });
  }
};

// ──────────────────────────────────────────────
//  TOUR MANAGEMENT
// ──────────────────────────────────────────────

exports.adminGetTours = async (req, res) => {
  try {
    const tours = await TourPackage.find().sort({ createdAt: -1 }).lean().exec();
    res.status(200).json({ success: true, count: tours.length, data: tours });
  } catch (err) {
    console.error('adminGetTours error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching tours' });
  }
};

exports.adminGetTour = async (req, res) => {
  try {
    const tour = await TourPackage.findById(req.params.id).lean();
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }
    res.status(200).json({ success: true, data: tour });
  } catch (err) {
    console.error('adminGetTour error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching tour' });
  }
};

exports.adminCreateTour = async (req, res) => {
  try {
    const {
      title, destination, description, priceMMK, priceUSD,
      duration, images, amenities, included, excluded,
      itinerary, maxGroupSize, status, rating,
    } = req.body;

    if (!title || !destination || !description || priceMMK == null || priceUSD == null) {
      return res.status(400).json({
        success: false,
        message: 'title, destination, description, priceMMK, and priceUSD are required',
      });
    }

    // Auto-generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now().toString(36);

    const tour = await TourPackage.create({
      title,
      slug,
      destination,
      description,
      priceMMK,
      priceUSD,
      duration: duration || '',
      images: Array.isArray(images) ? images : [],
      amenities: Array.isArray(amenities) ? amenities : [],
      included: Array.isArray(included) ? included : [],
      excluded: Array.isArray(excluded) ? excluded : [],
      itinerary: Array.isArray(itinerary) ? itinerary : [],
      maxGroupSize: maxGroupSize || 20,
      status: status || 'active',
      rating: rating || 4.5,
    });

    res.status(201).json({ success: true, data: tour });
  } catch (err) {
    console.error('adminCreateTour error:', err);
    res.status(500).json({ success: false, message: 'Server error creating tour' });
  }
};

exports.adminUpdateTour = async (req, res) => {
  try {
    const updates = { ...req.body };
    // Ensure arrays stay as arrays when updating
    ['images', 'amenities', 'included', 'excluded', 'itinerary'].forEach((field) => {
      if (field in updates && !Array.isArray(updates[field])) {
        delete updates[field];
      }
    });

    const tour = await TourPackage.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    res.status(200).json({ success: true, data: tour });
  } catch (err) {
    console.error('adminUpdateTour error:', err);
    res.status(500).json({ success: false, message: 'Server error updating tour' });
  }
};

exports.adminDeleteTour = async (req, res) => {
  try {
    const tour = await TourPackage.findByIdAndDelete(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }
    res.status(200).json({ success: true, message: 'Tour deleted successfully' });
  } catch (err) {
    console.error('adminDeleteTour error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting tour' });
  }
};

// ──────────────────────────────────────────────
//  HOTEL MANAGEMENT
// ──────────────────────────────────────────────

exports.adminGetHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 }).lean().exec();
    res.status(200).json({ success: true, count: hotels.length, data: hotels });
  } catch (err) {
    console.error('adminGetHotels error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching hotels' });
  }
};

exports.adminCreateHotel = async (req, res) => {
  try {
    const {
      name, location, address, description, rating,
      pricePerNight, pricePerNightUSD, availableRooms, totalRooms,
      amenities, images, roomTypes, status,
    } = req.body;

    if (!name || !location || pricePerNight == null || availableRooms == null) {
      return res.status(400).json({
        success: false,
        message: 'name, location, pricePerNight, and availableRooms are required',
      });
    }

    // Auto-generate slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now().toString(36);

    const hotel = await Hotel.create({
      name,
      slug,
      location,
      address: address || '',
      description: description || '',
      rating: rating || 4.0,
      pricePerNight,
      pricePerNightUSD: pricePerNightUSD || 0,
      availableRooms,
      totalRooms: totalRooms || 0,
      amenities: Array.isArray(amenities) ? amenities : [],
      images: Array.isArray(images) ? images : [],
      roomTypes: Array.isArray(roomTypes) ? roomTypes : [],
      status: status || 'active',
    });

    res.status(201).json({ success: true, data: hotel });
  } catch (err) {
    console.error('adminCreateHotel error:', err);
    res.status(500).json({ success: false, message: 'Server error creating hotel' });
  }
};

exports.adminUpdateHotel = async (req, res) => {
  try {
    const updates = { ...req.body };
    ['amenities', 'images', 'roomTypes'].forEach((field) => {
      if (field in updates && !Array.isArray(updates[field])) {
        delete updates[field];
      }
    });

    const hotel = await Hotel.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    res.status(200).json({ success: true, data: hotel });
  } catch (err) {
    console.error('adminUpdateHotel error:', err);
    res.status(500).json({ success: false, message: 'Server error updating hotel' });
  }
};

exports.adminDeleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    res.status(200).json({ success: true, message: 'Hotel deleted successfully' });
  } catch (err) {
    console.error('adminDeleteHotel error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting hotel' });
  }
};

// ──────────────────────────────────────────────
//  CAR MANAGEMENT
// ──────────────────────────────────────────────

exports.adminGetCars = async (req, res) => {
  try {
    const cars = await CarRental.find().sort({ createdAt: -1 }).lean().exec();
    res.status(200).json({ success: true, count: cars.length, data: cars });
  } catch (err) {
    console.error('adminGetCars error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching cars' });
  }
};

exports.adminCreateCar = async (req, res) => {
  try {
    const {
      carType, description, capacity,
      pricingWithDriver, images, features, status,
    } = req.body;

    if (!carType) {
      return res.status(400).json({
        success: false,
        message: 'carType is required',
      });
    }

    // Auto-generate slug
    const slug = carType
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now().toString(36);

    const car = await CarRental.create({
      carType,
      slug,
      description: description || '',
      capacity: capacity || 4,
      pricingWithDriver: Array.isArray(pricingWithDriver) ? pricingWithDriver : [],
      images: Array.isArray(images) ? images : [],
      features: Array.isArray(features) ? features : [],
      status: status || 'available',
    });

    res.status(201).json({ success: true, data: car });
  } catch (err) {
    console.error('adminCreateCar error:', err);
    res.status(500).json({ success: false, message: 'Server error creating car' });
  }
};

exports.adminUpdateCar = async (req, res) => {
  try {
    const updates = { ...req.body };
    ['pricingWithDriver', 'images', 'features'].forEach((field) => {
      if (field in updates && !Array.isArray(updates[field])) {
        delete updates[field];
      }
    });

    const car = await CarRental.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    res.status(200).json({ success: true, data: car });
  } catch (err) {
    console.error('adminUpdateCar error:', err);
    res.status(500).json({ success: false, message: 'Server error updating car' });
  }
};

exports.adminDeleteCar = async (req, res) => {
  try {
    const car = await CarRental.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    res.status(200).json({ success: true, message: 'Car deleted successfully' });
  } catch (err) {
    console.error('adminDeleteCar error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting car' });
  }
};

// ──────────────────────────────────────────────
//  VISA MANAGEMENT
// ──────────────────────────────────────────────

exports.adminGetVisas = async (req, res) => {
  try {
    const visas = await VisaService.find().sort({ createdAt: -1 }).lean().exec();
    res.status(200).json({ success: true, count: visas.length, data: visas });
  } catch (err) {
    console.error('adminGetVisas error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching visas' });
  }
};

exports.adminCreateVisa = async (req, res) => {
  try {
    const {
      country, countryCode, processingTime,
      visaFee, visaFeeUSD, requirements, additionalInfo, status,
    } = req.body;

    if (!country || visaFee == null) {
      return res.status(400).json({
        success: false,
        message: 'country and visaFee are required',
      });
    }

    const visa = await VisaService.create({
      country,
      countryCode: countryCode || '',
      processingTime: processingTime || '',
      visaFee,
      visaFeeUSD: visaFeeUSD || 0,
      requirements: Array.isArray(requirements) ? requirements : [],
      additionalInfo: additionalInfo || '',
      status: status || 'active',
    });

    res.status(201).json({ success: true, data: visa });
  } catch (err) {
    console.error('adminCreateVisa error:', err);
    res.status(500).json({ success: false, message: 'Server error creating visa' });
  }
};

exports.adminUpdateVisa = async (req, res) => {
  try {
    const updates = { ...req.body };
    if ('requirements' in updates && !Array.isArray(updates.requirements)) {
      delete updates.requirements;
    }

    const visa = await VisaService.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!visa) {
      return res.status(404).json({ success: false, message: 'Visa not found' });
    }

    res.status(200).json({ success: true, data: visa });
  } catch (err) {
    console.error('adminUpdateVisa error:', err);
    res.status(500).json({ success: false, message: 'Server error updating visa' });
  }
};

exports.adminDeleteVisa = async (req, res) => {
  try {
    const visa = await VisaService.findByIdAndDelete(req.params.id);
    if (!visa) {
      return res.status(404).json({ success: false, message: 'Visa not found' });
    }
    res.status(200).json({ success: true, message: 'Visa deleted successfully' });
  } catch (err) {
    console.error('adminDeleteVisa error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting visa' });
  }
};

// ──────────────────────────────────────────────
//  INSURANCE MANAGEMENT
// ──────────────────────────────────────────────

exports.adminGetInsurancePlans = async (req, res) => {
  try {
    const plans = await TravelInsurance.find().sort({ createdAt: -1 }).lean().exec();
    res.status(200).json({ success: true, count: plans.length, data: plans });
  } catch (err) {
    console.error('adminGetInsurancePlans error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching insurance plans' });
  }
};

exports.adminCreateInsurancePlan = async (req, res) => {
  try {
    const {
      planName, coverageAmount, coverageAmountUSD,
      premiumPrice, premiumPriceUSD, duration,
      benefits, exclusions, status,
    } = req.body;

    if (!planName || premiumPrice == null) {
      return res.status(400).json({
        success: false,
        message: 'planName and premiumPrice are required',
      });
    }

    // Auto-generate slug
    const slug = planName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now().toString(36);

    const plan = await TravelInsurance.create({
      planName,
      slug,
      coverageAmount: coverageAmount || 0,
      coverageAmountUSD: coverageAmountUSD || 0,
      premiumPrice,
      premiumPriceUSD: premiumPriceUSD || 0,
      duration: duration || '',
      benefits: Array.isArray(benefits) ? benefits : [],
      exclusions: Array.isArray(exclusions) ? exclusions : [],
      status: status || 'active',
    });

    res.status(201).json({ success: true, data: plan });
  } catch (err) {
    console.error('adminCreateInsurancePlan error:', err);
    res.status(500).json({ success: false, message: 'Server error creating insurance plan' });
  }
};

exports.adminUpdateInsurancePlan = async (req, res) => {
  try {
    const updates = { ...req.body };
    ['benefits', 'exclusions'].forEach((field) => {
      if (field in updates && !Array.isArray(updates[field])) {
        delete updates[field];
      }
    });

    const plan = await TravelInsurance.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Insurance plan not found' });
    }

    res.status(200).json({ success: true, data: plan });
  } catch (err) {
    console.error('adminUpdateInsurancePlan error:', err);
    res.status(500).json({ success: false, message: 'Server error updating insurance plan' });
  }
};

exports.adminDeleteInsurancePlan = async (req, res) => {
  try {
    const plan = await TravelInsurance.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Insurance plan not found' });
    }
    res.status(200).json({ success: true, message: 'Insurance plan deleted successfully' });
  } catch (err) {
    console.error('adminDeleteInsurancePlan error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting insurance plan' });
  }
};
