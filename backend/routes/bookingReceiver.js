const express = require("express");
const router = express.Router();
const BookingInquiry = require("../models/bookinginquiry");

// Generate unique reference number
function generateRef() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `A9-${ts}-${rand}`;
}

// POST /api/booking-receiver — Submit a new booking inquiry
router.post("/", async (req, res) => {
  try {
    const {
      fullName, email, phone, travelType,
      fromAirport, toAirport, departDate, returnDate,
      passengers, travelClass, specialRequests, contactPreference,
    } = req.body;

    // ── Validate required fields ──
    const errors = [];
    if (!fullName || !fullName.trim()) errors.push("Full name is required");
    if (!email || !email.trim()) errors.push("Email is required");
    if (!phone || !phone.trim()) errors.push("Phone is required");
    if (!travelType || !["flight", "hotel", "tour", "car", "visa", "insurance"].includes(travelType)) {
      errors.push("Valid travel type is required (flight/hotel/tour/car/visa/insurance)");
    }
    if (travelType === "flight") {
      if (!departDate) errors.push("Departure date is required for flights");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      errors.push("Please provide a valid email address");
    }

    // Validate phone format (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
    if (phone && !phoneRegex.test(phone)) {
      errors.push("Please provide a valid phone number");
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const referenceNumber = generateRef();

    const inquiry = await BookingInquiry.create({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      travelType,
      fromAirport: fromAirport || "",
      toAirport: toAirport || "",
      departDate: departDate || "",
      returnDate: returnDate || "",
      passengers: passengers || 1,
      travelClass: travelClass || "Economy",
      specialRequests: specialRequests || "",
      contactPreference: contactPreference || "email",
      status: "New",
      referenceNumber,
    });

    return res.status(201).json({
      success: true,
      message: "Booking inquiry submitted successfully!",
      referenceNumber,
      data: inquiry,
    });
  } catch (err) {
    console.error("bookingReceiver POST error:", err.message);
    return res.status(500).json({ success: false, message: "Server error submitting inquiry" });
  }
});

// GET /api/booking-receiver — Get all inquiries (admin)
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status && req.query.status !== "all") {
      filter.status = req.query.status;
    }
    if (req.query.travelType) {
      filter.travelType = req.query.travelType;
    }

    const [inquiries, total] = await Promise.all([
      BookingInquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      BookingInquiry.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: inquiries,
      pagination: {
        page, limit, total, totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("bookingReceiver GET error:", err.message);
    return res.status(500).json({ success: false, message: "Server error fetching inquiries" });
  }
});

// PATCH /api/booking-receiver/:id — Update inquiry status
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !["New", "Contacted", "Confirmed", "Cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be: New, Contacted, Confirmed, or Cancelled",
      });
    }

    const inquiry = await BookingInquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    return res.status(200).json({ success: true, data: inquiry });
  } catch (err) {
    console.error("bookingReceiver PATCH error:", err.message);
    return res.status(500).json({ success: false, message: "Server error updating inquiry" });
  }
});

module.exports = router;
