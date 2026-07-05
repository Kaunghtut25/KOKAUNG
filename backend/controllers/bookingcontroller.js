const Booking = require('../models/booking');
const TourPackage = require('../models/tourpackage');
const Hotel = require('../models/hotel');
const CarRental = require('../models/carrental');
const VisaService = require('../models/visaservice');
const TravelInsurance = require('../models/travelinsurance');

/**
 * Map item type string to its model.
 */
const getItemModel = (itemType) => {
  const models = {
    TourPackage,
    Hotel,
    CarRental,
    VisaService,
    TravelInsurance,
  };
  return models[itemType] || null;
};

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Private
 */
const createBooking = async (req, res) => {
  try {
    const { itemType, itemId, quantity, startDate, endDate, specialRequests } = req.body;

    // Validate required fields
    if (!itemType || !itemId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'itemType, itemId, and quantity are required',
      });
    }

    if (!['TourPackage', 'Hotel', 'CarRental', 'VisaService', 'TravelInsurance'].includes(itemType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid itemType',
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    // Lookup item by type and ID to get the price
    const ItemModel = getItemModel(itemType);
    if (!ItemModel) {
      return res.status(400).json({
        success: false,
        message: `Unknown item type: ${itemType}`,
      });
    }

    const item = await ItemModel.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `${itemType} not found`,
      });
    }

    // Calculate total price - try multiple price field names
    const price = item.price || item.priceMMK || item.pricePerNight || item.visaFee || item.premiumPrice || 0;
    const totalAmount = price * quantity;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      itemType,
      item: itemId,
      itemModel: itemType,
      quantity,
      startDate: startDate || null,
      endDate: endDate || null,
      specialRequests: specialRequests || '',
      totalAmount,
      totalPrice: totalAmount,
      bookingStatus: 'pending',
      paymentStatus: 'pending',
    });

    return res.status(201).json({
      success: true,
      booking,
    });
  } catch (err) {
    console.error('createBooking error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error creating booking',
    });
  }
};

/**
 * @desc    Get all bookings for the authenticated user
 * @route   GET /api/bookings
 * @access  Private
 */
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('item', 'name title price images')
      .sort({ createdAt: -1 })
      .exec();

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    console.error('getMyBookings error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching bookings',
    });
  }
};

/**
 * @desc    Get a single booking by ID (ownership verified)
 * @route   GET /api/bookings/:id
 * @access  Private
 */
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    // Manually populate item
    if (booking && booking.item) {
      const ItemModel = getItemModel(booking.itemModel || 'TourPackage');
      if (ItemModel) {
        const item = await ItemModel.findById(booking.item);
        if (item) {
          booking.item = item;
        }
      }
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Verify ownership
    if (booking.user !== req.user._id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking',
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (err) {
    console.error('getBookingById error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching booking',
    });
  }
};

/**
 * @desc    Cancel a booking (only if payment is still pending)
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private
 */
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Verify ownership
    if (booking.user !== req.user._id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    // Only allow cancellation if payment is still pending
    if (booking.paymentStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a booking that has already been paid or processed',
      });
    }

    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: { bookingStatus: 'cancelled' } }
    );

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: updated,
    });
  } catch (err) {
    console.error('cancelBooking error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error cancelling booking',
    });
  }
};

/**
 * @desc    Process payment for a booking (simulated)
 * @route   POST /api/bookings/:id/pay
 * @access  Private
 */
const processPayment = async (req, res) => {
  try {
    const { paymentMethod, paymentMetadata } = req.body;

    if (!paymentMethod || !paymentMetadata) {
      return res.status(400).json({
        success: false,
        message: 'paymentMethod and paymentMetadata are required',
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Verify ownership
    if (booking.user !== req.user._id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to process payment for this booking',
      });
    }

    // Check if already paid
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been paid',
      });
    }

    // Simulated payment: only process if transactionId starts with "SIM"
    if (
      !paymentMetadata.transactionId ||
      !paymentMetadata.transactionId.startsWith('SIM')
    ) {
      return res.status(400).json({
        success: false,
        message: 'Payment failed: invalid transaction ID. Use a transactionId starting with "SIM" for simulated payments.',
      });
    }

    // Mark as paid and store metadata
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          paymentStatus: 'paid',
          paymentMethod,
          paymentMetadata: {
            transactionId: paymentMetadata.transactionId,
            paidAt: new Date().toISOString(),
            ...paymentMetadata,
          },
          bookingStatus: 'confirmed',
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      booking: updated,
    });
  } catch (err) {
    console.error('processPayment error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error processing payment',
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  processPayment,
};
