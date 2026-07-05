// Visa Service Controller for A9 Global
// =======================================

const Visa = require('../models/visaservice');

// ─── getVisas ─────────────────────────────────────────────────

const getVisas = async (req, res) => {
  try {
    const {
      country,
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

    if (country && country.trim()) {
      query.country = new RegExp(country.trim(), 'i');
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
      case 'newest':
      default:
        sortObj = { createdAt: -1 };
        break;
    }

    const [total, visas] = await Promise.all([
      Visa.countDocuments(query),
      Visa.find(query).sort(sortObj).skip(skip).limit(limitNum).lean().exec(),
    ]);

    return res.status(200).json({
      success: true,
      data: visas,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('getVisas error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching visa services',
      error: error.message,
    });
  }
};

// ─── getVisa ──────────────────────────────────────────────────

const getVisa = async (req, res) => {
  try {
    const { id } = req.params;

    let visa;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      visa = await Visa.findById(id).lean();
    }
    if (!visa) {
      visa = await Visa.findOne({ slug: id }).lean();
    }

    if (!visa) {
      return res.status(404).json({
        success: false,
        message: 'Visa service not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: visa,
    });
  } catch (error) {
    console.error('getVisa error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching visa service',
      error: error.message,
    });
  }
};

// ─── createVisa ───────────────────────────────────────────────

const createVisa = async (req, res) => {
  try {
    const visaData = req.body;
    const visa = await Visa.create(visaData);

    return res.status(201).json({
      success: true,
      message: 'Visa service created successfully',
      data: visa,
    });
  } catch (error) {
    console.error('createVisa error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating visa service',
      error: error.message,
    });
  }
};

// ─── updateVisa ───────────────────────────────────────────────

const updateVisa = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let visa;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      visa = await Visa.findByIdAndUpdate(id, updateData, {
        new: true,
      });
    }
    if (!visa) {
      visa = await Visa.findOneAndUpdate({ slug: id }, updateData, {
        new: true,
      });
    }

    if (!visa) {
      return res.status(404).json({
        success: false,
        message: 'Visa service not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Visa service updated successfully',
      data: visa,
    });
  } catch (error) {
    console.error('updateVisa error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating visa service',
      error: error.message,
    });
  }
};

// ─── deleteVisa ───────────────────────────────────────────────

const deleteVisa = async (req, res) => {
  try {
    const { id } = req.params;

    let visa;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      visa = await Visa.findByIdAndDelete(id);
    }
    if (!visa) {
      visa = await Visa.findOneAndDelete({ slug: id });
    }

    if (!visa) {
      return res.status(404).json({
        success: false,
        message: 'Visa service not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Visa service deleted successfully',
    });
  } catch (error) {
    console.error('deleteVisa error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting visa service',
      error: error.message,
    });
  }
};

module.exports = {
  getVisas,
  getVisa,
  createVisa,
  updateVisa,
  deleteVisa,
};
