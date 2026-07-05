// Car Rental Controller for A9 Global
// ======================================

const CarRental = require('../models/carrental');

// ─── getCars ──────────────────────────────────────────────────

const getCars = async (req, res) => {
  try {
    const {
      destination,
      carType,
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

    if (carType && carType.trim()) {
      query.carType = new RegExp(carType.trim(), 'i');
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

    const [total, cars] = await Promise.all([
      CarRental.countDocuments(query),
      CarRental.find(query).sort(sortObj).skip(skip).limit(limitNum).lean().exec(),
    ]);

    return res.status(200).json({
      success: true,
      data: cars,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('getCars error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching cars',
      error: error.message,
    });
  }
};

// ─── getCar ───────────────────────────────────────────────────

const getCar = async (req, res) => {
  try {
    const { id } = req.params;

    let car;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      car = await CarRental.findById(id).lean();
    }
    if (!car) {
      car = await CarRental.findOne({ slug: id }).lean();
    }

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car rental not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: car,
    });
  } catch (error) {
    console.error('getCar error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching car',
      error: error.message,
    });
  }
};

// ─── createCar ────────────────────────────────────────────────

const createCar = async (req, res) => {
  try {
    const carData = req.body;

    // Auto-generate slug from carType
    if (carData.carType && !carData.slug) {
      carData.slug = carData.carType
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        + '-' + Date.now().toString(36);
    }

    const car = await CarRental.create(carData);

    return res.status(201).json({
      success: true,
      message: 'Car rental created successfully',
      data: car,
    });
  } catch (error) {
    console.error('createCar error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating car rental',
      error: error.message,
    });
  }
};

// ─── updateCar ────────────────────────────────────────────────

const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let car;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      car = await CarRental.findByIdAndUpdate(id, updateData, {
        new: true,
      });
    }
    if (!car) {
      car = await CarRental.findOneAndUpdate({ slug: id }, updateData, {
        new: true,
      });
    }

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car rental not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Car rental updated successfully',
      data: car,
    });
  } catch (error) {
    console.error('updateCar error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating car rental',
      error: error.message,
    });
  }
};

// ─── deleteCar ────────────────────────────────────────────────

const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    let car;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      car = await CarRental.findByIdAndDelete(id);
    }
    if (!car) {
      car = await CarRental.findOneAndDelete({ slug: id });
    }

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car rental not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Car rental deleted successfully',
    });
  } catch (error) {
    console.error('deleteCar error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting car rental',
      error: error.message,
    });
  }
};

module.exports = {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
};
