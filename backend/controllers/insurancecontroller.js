// Insurance Controller for A9 Global
// =====================================

const Insurance = require('../models/travelinsurance');

// ─── getInsurancePlans ────────────────────────────────────────

const getInsurancePlans = async (req, res) => {
  try {
    const {
      type,
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

    if (type && type.trim()) {
      query.type = new RegExp(type.trim(), 'i');
    }

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
      case 'newest':
      default:
        sortObj = { createdAt: -1 };
        break;
    }

    const [total, plans] = await Promise.all([
      Insurance.countDocuments(query),
      Insurance.find(query).sort(sortObj).skip(skip).limit(limitNum).lean().exec(),
    ]);

    return res.status(200).json({
      success: true,
      data: plans,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('getInsurancePlans error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching insurance plans',
      error: error.message,
    });
  }
};

// ─── getInsurancePlan ─────────────────────────────────────────

const getInsurancePlan = async (req, res) => {
  try {
    const { id } = req.params;

    let plan;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      plan = await Insurance.findById(id).lean();
    }
    if (!plan) {
      plan = await Insurance.findOne({ slug: id }).lean();
    }

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Insurance plan not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.error('getInsurancePlan error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching insurance plan',
      error: error.message,
    });
  }
};

// ─── createInsurancePlan ──────────────────────────────────────

const createInsurancePlan = async (req, res) => {
  try {
    const planData = req.body;

    // Auto-generate slug from planName
    if (planData.planName && !planData.slug) {
      planData.slug = planData.planName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        + '-' + Date.now().toString(36);
    }

    const plan = await Insurance.create(planData);

    return res.status(201).json({
      success: true,
      message: 'Insurance plan created successfully',
      data: plan,
    });
  } catch (error) {
    console.error('createInsurancePlan error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating insurance plan',
      error: error.message,
    });
  }
};

// ─── updateInsurancePlan ──────────────────────────────────────

const updateInsurancePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let plan;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      plan = await Insurance.findByIdAndUpdate(id, updateData, {
        new: true,
      });
    }
    if (!plan) {
      plan = await Insurance.findOneAndUpdate({ slug: id }, updateData, {
        new: true,
      });
    }

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Insurance plan not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Insurance plan updated successfully',
      data: plan,
    });
  } catch (error) {
    console.error('updateInsurancePlan error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating insurance plan',
      error: error.message,
    });
  }
};

// ─── deleteInsurancePlan ──────────────────────────────────────

const deleteInsurancePlan = async (req, res) => {
  try {
    const { id } = req.params;

    let plan;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      plan = await Insurance.findByIdAndDelete(id);
    }
    if (!plan) {
      plan = await Insurance.findOneAndDelete({ slug: id });
    }

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Insurance plan not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Insurance plan deleted successfully',
    });
  } catch (error) {
    console.error('deleteInsurancePlan error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting insurance plan',
      error: error.message,
    });
  }
};

module.exports = {
  getInsurancePlans,
  getInsurancePlan,
  createInsurancePlan,
  updateInsurancePlan,
  deleteInsurancePlan,
};
