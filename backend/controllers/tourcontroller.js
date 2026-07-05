// Tour Package Controller for A9 Global
// =======================================

const TourPackage = require('../models/tourpackage');

// ─── getTours ─────────────────────────────────────────────────

const getTours = async (req, res) => {
  try {
    const {
      destination,
      minPrice,
      maxPrice,
      status,
      sort = 'newest',
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
      default:
        sortObj = { createdAt: -1 };
        break;
    }

    const [total, tours] = await Promise.all([
      TourPackage.countDocuments(query),
      TourPackage.find(query).sort(sortObj).skip(skip).limit(limitNum).lean().exec(),
    ]);

    return res.status(200).json({
      success: true,
      data: tours,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('getTours error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching tours',
      error: error.message,
    });
  }
};

// ─── getTour ──────────────────────────────────────────────────

const getTour = async (req, res) => {
  try {
    const { id } = req.params;

    // Try by ID first, then by slug
    let tour;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      tour = await TourPackage.findById(id).lean();
    }
    if (!tour) {
      tour = await TourPackage.findOne({ slug: id }).lean();
    }

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour package not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: tour,
    });
  } catch (error) {
    console.error('getTour error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching tour',
      error: error.message,
    });
  }
};

// ─── getFeaturedTours ─────────────────────────────────────────

const getFeaturedTours = async (req, res) => {
  try {
    const tours = await TourPackage.find({ status: 'featured' })
      .sort({ rating: -1 })
      .limit(6)
      .lean()
      .exec();

    return res.status(200).json({
      success: true,
      data: tours,
    });
  } catch (error) {
    console.error('getFeaturedTours error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching featured tours',
      error: error.message,
    });
  }
};

// ─── createTour ───────────────────────────────────────────────

const createTour = async (req, res) => {
  try {
    const tourData = req.body;

    // Auto-generate slug from title
    if (tourData.title && !tourData.slug) {
      tourData.slug = tourData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        + '-' + Date.now().toString(36);
    }

    const tour = await TourPackage.create(tourData);

    return res.status(201).json({
      success: true,
      message: 'Tour package created successfully',
      data: tour,
    });
  } catch (error) {
    console.error('createTour error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating tour',
      error: error.message,
    });
  }
};

// ─── updateTour ───────────────────────────────────────────────

const updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let tour;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      tour = await TourPackage.findByIdAndUpdate(id, updateData, {
        new: true,
      });
    }
    if (!tour) {
      tour = await TourPackage.findOneAndUpdate({ slug: id }, updateData, {
        new: true,
      });
    }

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour package not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Tour package updated successfully',
      data: tour,
    });
  } catch (error) {
    console.error('updateTour error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating tour',
      error: error.message,
    });
  }
};

// ─── deleteTour ───────────────────────────────────────────────

const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    let tour;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      tour = await TourPackage.findByIdAndDelete(id);
    }
    if (!tour) {
      tour = await TourPackage.findOneAndDelete({ slug: id });
    }

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour package not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Tour package deleted successfully',
    });
  } catch (error) {
    console.error('deleteTour error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting tour',
      error: error.message,
    });
  }
};

module.exports = {
  getTours,
  getTour,
  getFeaturedTours,
  createTour,
  updateTour,
  deleteTour,
};
