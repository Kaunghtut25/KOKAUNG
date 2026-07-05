// Search Controller for A9 Global
// ================================

const TourPackage = require('../models/tourpackage');
const Hotel = require('../models/hotel');
const CarRental = require('../models/carrental');

/**
 * Build sort object based on sort param.
 */
function buildSort(sortParam) {
  switch (sortParam) {
    case 'price_asc':
      return { price: 1 };
    case 'price_desc':
      return { price: -1 };
    case 'rating':
      return { rating: -1 };
    case 'newest':
      return { createdAt: -1 };
    default:
      return { rating: -1 };
  }
}

/**
 * Build a combined query for a given model and filters.
 */
function buildQuery(modelFields, { q, destination, minPrice, maxPrice, date, additionalFilter }) {
  const query = {};

  // Text search
  if (q && q.trim()) {
    const regex = new RegExp(q.trim(), 'i');
    const orFields = modelFields.map((f) => ({ [f]: { $regex: regex } }));
    query.$or = orFields;
  }

  // Destination filter
  if (destination && destination.trim()) {
    const destRegex = { $regex: new RegExp(destination.trim(), 'i') };
    query.$or = query.$or || [];
    // Add destination/location to $or
    const destFields = ['destination', 'location', 'city', 'country'];
    destFields.forEach((f) => query.$or.push({ [f]: destRegex }));
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
  }

  // Travel date filter
  if (date && date.trim()) {
    query.availableDates = { $in: [new Date(date)] };
  }

  // Merge additional filters
  if (additionalFilter) {
    Object.assign(query, additionalFilter);
  }

  return query;
}

// ─── searchAll ────────────────────────────────────────────────

const searchAll = async (req, res) => {
  try {
    const {
      q = '',
      destination = '',
      type = 'all',
      minPrice,
      maxPrice,
      date,
      sort = 'rating',
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;
    const sortObj = buildSort(sort);

    let results = [];
    let totalCount = 0;

    const searchTypes = type === 'all' ? ['tour', 'hotel', 'car'] : [type];

    const promises = [];

    if (searchTypes.includes('tour')) {
      const tourFields = ['title', 'description', 'name'];
      const tourQuery = buildQuery(tourFields, { q, destination, minPrice, maxPrice, date });
      promises.push(
        TourPackage.countDocuments(tourQuery).then((count) => ({ type: 'tour', count })),
        TourPackage.find(tourQuery)
          .sort(sortObj)
          .skip(skip)
          .limit(limitNum)
          .lean()
          .exec()
          .then((docs) => ({ type: 'tour', docs })),
      );
    }

    if (searchTypes.includes('hotel')) {
      const hotelFields = ['name', 'description', 'title'];
      const hotelQuery = buildQuery(hotelFields, { q, destination, minPrice, maxPrice, date });
      promises.push(
        Hotel.countDocuments(hotelQuery).then((count) => ({ type: 'hotel', count })),
        Hotel.find(hotelQuery)
          .sort(sortObj)
          .skip(skip)
          .limit(limitNum)
          .lean()
          .exec()
          .then((docs) => ({ type: 'hotel', docs })),
      );
    }

    if (searchTypes.includes('car')) {
      const carFields = ['carType', 'description', 'name'];
      const carQuery = buildQuery(carFields, { q, destination, minPrice, maxPrice, date });
      promises.push(
        CarRental.countDocuments(carQuery).then((count) => ({ type: 'car', count })),
        CarRental.find(carQuery)
          .sort(sortObj)
          .skip(skip)
          .limit(limitNum)
          .lean()
          .exec()
          .then((docs) => ({ type: 'car', docs })),
      );
    }

    const allResults = await Promise.all(promises);

    // Group results by type
    const grouped = {};
    const counts = {};
    for (const r of allResults) {
      if (r.count !== undefined) {
        counts[r.type] = r.count;
        totalCount += r.count;
      }
      if (r.docs !== undefined) {
        grouped[r.type] = r.docs;
      }
    }

    // Flatten results
    for (const t of searchTypes) {
      if (grouped[t]) {
        results = results.concat(grouped[t].map((doc) => ({ ...doc, _type: t })));
      }
    }

    // Re-sort combined results
    if (sort === 'price_asc') {
      results.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === 'price_desc') {
      results.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    // Slice to limit after merge
    results = results.slice(0, limitNum);

    return res.status(200).json({
      success: true,
      data: results,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (error) {
    console.error('searchAll error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during search',
      error: error.message,
    });
  }
};

// ─── searchTours ──────────────────────────────────────────────

const searchTours = async (req, res) => {
  try {
    const {
      q = '',
      destination = '',
      minPrice,
      maxPrice,
      date,
      duration,
      amenities,
      sort = 'rating',
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;
    const sortObj = buildSort(sort);

    const additionalFilter = {};

    // Duration filter
    if (duration && duration.trim()) {
      additionalFilter.duration = { $regex: new RegExp(duration.trim(), 'i') };
    }

    // Amenities filter (comma-separated or repeated)
    if (amenities) {
      const amenitiesArr = Array.isArray(amenities)
        ? amenities
        : amenities.split(',').map((a) => a.trim());
      if (amenitiesArr.length > 0) {
        additionalFilter.amenities = { $all: amenitiesArr };
      }
    }

    const tourFields = ['title', 'description', 'name'];
    const query = buildQuery(tourFields, { q, destination, minPrice, maxPrice, date, additionalFilter });

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
    console.error('searchTours error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during tour search',
      error: error.message,
    });
  }
};

// ─── getSearchSuggestions ─────────────────────────────────────

const getSearchSuggestions = async (req, res) => {
  try {
    const { q = '' } = req.query;

    if (!q || !q.trim()) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const regex = new RegExp(q.trim(), 'i');
    const limit = 5;

    const [tours, hotels, cars] = await Promise.all([
      TourPackage.find({ title: { $regex: regex } }).limit(limit).lean().exec(),
      Hotel.find({ name: { $regex: regex } }).limit(limit).lean().exec(),
      CarRental.find({ carType: { $regex: regex } }).limit(limit).lean().exec(),
    ]);

    const suggestions = [
      ...tours.map((t) => ({ text: t.title, type: 'tour' })),
      ...hotels.map((h) => ({ text: h.name, type: 'hotel' })),
      ...cars.map((c) => ({ text: c.carType, type: 'car' })),
    ].slice(0, 5);

    return res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error('getSearchSuggestions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching suggestions',
      error: error.message,
    });
  }
};

module.exports = {
  searchAll,
  searchTours,
  getSearchSuggestions,
};
