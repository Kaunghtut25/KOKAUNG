// Hotel Controller for A9 Global
// ================================

const Hotel = require('../models/hotel');

// ─── getHotels ────────────────────────────────────────────────

const getHotels = async (req, res) => {
  try {
    const {
      destination,
      minPrice,
      maxPrice,
      status,
      sort = 'rating',
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (destination && destination.trim()) {
      query.destination = new RegExp(destination.trim(), 'i');
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    if (status && status.trim()) {
      query.status = status.trim();
    }

    let sortObj;
    switch (sort) {
      case 'price_asc':
        sortObj = { price: 1 };
        break;
      case 'price_desc':
        sortObj = { price: -1 };
        break;
      case 'rating':
        sortObj = { rating: -1 };
        break;
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      default:
        sortObj = { rating: -1 };
        break;
    }

    const [total, hotels] = await Promise.all([
      Hotel.countDocuments(query),
      Hotel.find(query).sort(sortObj).skip(skip).limit(limitNum).lean().exec(),
    ]);

    return res.status(200).json({
      success: true,
      data: hotels,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('getHotels error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching hotels',
      error: error.message,
    });
  }
};

// ─── getHotel ─────────────────────────────────────────────────

const getHotel = async (req, res) => {
  try {
    const { id } = req.params;

    let hotel;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      hotel = await Hotel.findById(id).lean();
    }
    if (!hotel) {
      hotel = await Hotel.findOne({ slug: id }).lean();
    }

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    console.error('getHotel error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching hotel',
      error: error.message,
    });
  }
};

// ─── createHotel ──────────────────────────────────────────────

const createHotel = async (req, res) => {
  try {
    const hotelData = req.body;

    // Auto-generate slug from name
    if (hotelData.name && !hotelData.slug) {
      hotelData.slug = hotelData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        + '-' + Date.now().toString(36);
    }

    const hotel = await Hotel.create(hotelData);

    return res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: hotel,
    });
  } catch (error) {
    console.error('createHotel error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating hotel',
      error: error.message,
    });
  }
};

// ─── updateHotel ──────────────────────────────────────────────

const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let hotel;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      hotel = await Hotel.findByIdAndUpdate(id, updateData, {
        new: true,
      });
    }
    if (!hotel) {
      hotel = await Hotel.findOneAndUpdate({ slug: id }, updateData, {
        new: true,
      });
    }

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Hotel updated successfully',
      data: hotel,
    });
  } catch (error) {
    console.error('updateHotel error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating hotel',
      error: error.message,
    });
  }
};

// ─── deleteHotel ──────────────────────────────────────────────

const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    let hotel;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      hotel = await Hotel.findByIdAndDelete(id);
    }
    if (!hotel) {
      hotel = await Hotel.findOneAndDelete({ slug: id });
    }

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Hotel deleted successfully',
    });
  } catch (error) {
    console.error('deleteHotel error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting hotel',
      error: error.message,
    });
  }
};

module.exports = {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
};
