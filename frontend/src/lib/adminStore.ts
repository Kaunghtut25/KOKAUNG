// ─── In-memory admin store (Vercel serverless compatible) ───
// Uses a module-level Map that persists across warm invocations.

const collections = new Map<string, Map<string, unknown>>();

function generateId(): string {
  const chars = "0123456789abcdef";
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return chars[v];
  });
}

export function seed() {
  if (collections.size > 0) return; // already seeded

  // ── Tours ──
  const tours = new Map<string, unknown>();
  const tourData = [
    {
      id: "ft1", title: "Golden Land Explorer", destination: "Yangon - Bagan - Mandalay",
      description: "Explore the golden land of Myanmar from Yangon to Bagan and Mandalay. Visit ancient temples, experience local culture, and enjoy stunning sunsets over the Irrawaddy River.",
      priceMMK: 1850000, priceUSD: 881, duration: "8D/7N", maxGroupSize: 20,
      images: "https://picsum.photos/seed/a9tour1/600/400",
      amenities: "Hotel, Breakfast, Guide, Transport", included: "Accommodation, Daily Breakfast, English-speaking Guide, Airport Transfers",
      excluded: "International Flights, Visa Fees, Travel Insurance", status: "active",
    },
    {
      id: "ft2", title: "Bagan Sunrise Discovery", destination: "Bagan",
      description: "Witness the magical sunrise over the ancient plains of Bagan. Explore thousands of temples and pagodas dating back to the 11th century.",
      priceMMK: 950000, priceUSD: 452, duration: "5D/4N", maxGroupSize: 15,
      images: "https://picsum.photos/seed/a9tour2/600/400",
      amenities: "Hotel, Breakfast, E-Bike Rental", included: "Accommodation, Breakfast, E-Bike, Guide",
      excluded: "Flights, Personal Expenses", status: "active",
    },
    {
      id: "ft3", title: "Mandalay Royal Heritage", destination: "Mandalay",
      description: "Discover the royal heritage of Mandalay, the last capital of the Burmese kingdom. Visit the famous U Bein Bridge and Mandalay Hill.",
      priceMMK: 750000, priceUSD: 357, duration: "4D/3N", maxGroupSize: 20,
      images: "https://picsum.photos/seed/a9tour3/600/400",
      amenities: "Hotel, Guide, Transport", included: "Accommodation, Guide, Transport, Entrance Fees",
      excluded: "Meals, Personal Expenses", status: "active",
    },
    {
      id: "ft4", title: "Inle Lake Serenity", destination: "Inle Lake",
      description: "Experience the floating gardens and unique leg-rowing fishermen of Inle Lake. A peaceful retreat in the Shan Hills.",
      priceMMK: 1100000, priceUSD: 524, duration: "5D/4N", maxGroupSize: 16,
      images: "https://picsum.photos/seed/a9tour4/600/400",
      amenities: "Resort, Breakfast, Boat Tours", included: "Accommodation, Boat Trips, Guide, Meals",
      excluded: "Flights, Drinks", status: "featured",
    },
    {
      id: "ft5", title: "Ngapali Beach Escape", destination: "Ngapali Beach",
      description: "Relax on the pristine white sands of Ngapali Beach. Crystal clear waters and fresh seafood make this the perfect tropical getaway.",
      priceMMK: 1350000, priceUSD: 643, duration: "4D/3N", maxGroupSize: 18,
      images: "https://picsum.photos/seed/a9tour5/600/400",
      amenities: "Beach Resort, Breakfast, Spa", included: "Accommodation, Breakfast, Airport Transfers",
      excluded: "Spa Treatments, Water Sports", status: "active",
    },
    {
      id: "ft6", title: "Yangon Cultural Tour", destination: "Yangon",
      description: "Immerse yourself in the culture and history of Yangon. Visit the magnificent Shwedagon Pagoda and bustling local markets.",
      priceMMK: 450000, priceUSD: 214, duration: "3D/2N", maxGroupSize: 25,
      images: "https://picsum.photos/seed/a9tour6/600/400",
      amenities: "Hotel, Guide, Transport", included: "Accommodation, Guide, Entrance Fees",
      excluded: "Meals, Shopping", status: "active",
    },
  ];
  tourData.forEach((t) => tours.set(t.id, t));

  // ── Hotels ──
  const hotels = new Map<string, unknown>();
  const hotelData = [
    {
      id: "fh1", name: "Sule Shangri-La Yangon", location: "Yangon",
      address: "223 Sule Pagoda Road, Yangon", description: "Luxurious 5-star hotel in the heart of Yangon with stunning city views and world-class amenities.",
      rating: 4.7, pricePerNightMMK: 180000, pricePerNightUSD: 86, availableRooms: 20, totalRooms: 30,
      amenities: "Pool, Spa, Gym, Restaurant, Bar", images: "https://picsum.photos/seed/a9hotel1/600/400",
      roomTypes: [], status: "active",
    },
    {
      id: "fh2", name: "The Strand Yangon", location: "Yangon",
      address: "92 Strand Road, Yangon", description: "Historic colonial-era hotel offering timeless elegance and refined luxury in downtown Yangon.",
      rating: 4.9, pricePerNightMMK: 350000, pricePerNightUSD: 167, availableRooms: 8, totalRooms: 12,
      amenities: "Restaurant, Bar, Butler Service, Spa", images: "https://picsum.photos/seed/a9hotel2/600/400",
      roomTypes: [], status: "active",
    },
    {
      id: "fh3", name: "Aureum Palace Bagan", location: "Bagan",
      address: "Bagan-Nyaung U Road, Bagan", description: "A stunning resort nestled among the ancient temples of Bagan with traditional Burmese architecture.",
      rating: 4.8, pricePerNightMMK: 220000, pricePerNightUSD: 105, availableRooms: 30, totalRooms: 45,
      amenities: "Pool, Spa, Restaurant, Temple Views", images: "https://picsum.photos/seed/a9hotel3/600/400",
      roomTypes: [], status: "featured",
    },
    {
      id: "fh4", name: "Inle Princess Resort", location: "Inle Lake",
      address: "Inle Lake, Shan State", description: "Beautiful lakeside resort with traditional floating bungalows and stunning mountain views.",
      rating: 4.6, pricePerNightMMK: 160000, pricePerNightUSD: 76, availableRooms: 25, totalRooms: 35,
      amenities: "Lake Views, Spa, Restaurant, Boat Service", images: "https://picsum.photos/seed/a9hotel4/600/400",
      roomTypes: [], status: "active",
    },
    {
      id: "fh5", name: "Ngapali Bay Hotel", location: "Ngapali Beach",
      address: "Ngapali Beach, Rakhine State", description: "Beachfront resort with direct access to the pristine white sands of Ngapali Beach.",
      rating: 4.7, pricePerNightMMK: 250000, pricePerNightUSD: 119, availableRooms: 40, totalRooms: 55,
      amenities: "Beachfront, Pool, Water Sports, Restaurant", images: "https://picsum.photos/seed/a9hotel5/600/400",
      roomTypes: [], status: "active",
    },
    {
      id: "fh6", name: "Mandalay Hill Resort", location: "Mandalay",
      address: "Mandalay Hill, Mandalay", description: "Magnificent resort at the foot of Mandalay Hill with panoramic views of the city and royal palace.",
      rating: 4.3, pricePerNightMMK: 120000, pricePerNightUSD: 57, availableRooms: 55, totalRooms: 70,
      amenities: "Pool, Gym, Restaurant, City Views", images: "https://picsum.photos/seed/a9hotel6/600/400",
      roomTypes: [], status: "active",
    },
  ];
  hotelData.forEach((h) => hotels.set(h.id, h));

  // ── Cars ──
  const cars = new Map<string, unknown>();
  const carData = [
    {
      id: "fc1", carType: "Toyota Alphard", description: "Premium luxury MPV with seating for 6 passengers. Perfect for family trips and executive travel.",
      capacity: 6, features: "AC, Leather Seats, WiFi, Refreshments", images: "https://picsum.photos/seed/a9car1/600/400",
      pricing: [{ duration: "Full Day", priceMMK: 100000, priceUSD: 48 }], status: "active",
    },
    {
      id: "fc2", carType: "Toyota Vios", description: "Reliable sedan with comfortable seating for 4 passengers. Ideal for city transfers and short trips.",
      capacity: 4, features: "AC, GPS, Fuel Included", images: "https://picsum.photos/seed/a9car2/600/400",
      pricing: [{ duration: "Full Day", priceMMK: 60000, priceUSD: 29 }], status: "active",
    },
    {
      id: "fc3", carType: "Toyota Hiace", description: "Spacious van for up to 12 passengers. Perfect for group tours and airport transfers.",
      capacity: 12, features: "AC, Luggage Space, Comfortable Seats", images: "https://picsum.photos/seed/a9car3/600/400",
      pricing: [{ duration: "Full Day", priceMMK: 140000, priceUSD: 67 }], status: "active",
    },
    {
      id: "fc4", carType: "Honda CR-V", description: "Modern SUV with seating for 5. Great for countryside exploration and rough terrain.",
      capacity: 5, features: "AC, Sunroof, 4WD", images: "https://picsum.photos/seed/a9car4/600/400",
      pricing: [{ duration: "Full Day", priceMMK: 85000, priceUSD: 40 }], status: "active",
    },
    {
      id: "fc5", carType: "Mercedes S-Class", description: "Ultimate luxury sedan for VIPs. Premium comfort with massage seats and privacy partition.",
      capacity: 3, features: "AC, WiFi, Massage Seats, Privacy", images: "https://picsum.photos/seed/a9car5/600/400",
      pricing: [{ duration: "Full Day", priceMMK: 250000, priceUSD: 119 }], status: "active",
    },
    {
      id: "fc6", carType: "Toyota Land Cruiser Prado", description: "Powerful 7-seater SUV with 4WD capability. Ideal for adventure tours and off-road journeys.",
      capacity: 7, features: "AC, 4WD, Sunroof, Premium Audio", images: "https://picsum.photos/seed/a9car6/600/400",
      pricing: [{ duration: "Full Day", priceMMK: 180000, priceUSD: 86 }], status: "active",
    },
  ];
  carData.forEach((c) => cars.set(c.id, c));

  // ── Visas ──
  const visas = new Map<string, unknown>();
  const visaData = [
    { id: "v1", country: "Thailand", countryCode: "TH", processingTime: "3-5 Business Days", visaFeeMMK: 85000, visaFeeUSD: 40, requirements: "Passport (6 months validity), 2 Passport Photos, Flight Booking", additionalInfo: "", status: "active" },
    { id: "v2", country: "Singapore", countryCode: "SG", processingTime: "5-7 Business Days", visaFeeMMK: 120000, visaFeeUSD: 57, requirements: "Passport (6 months), 2 Passport Photos, Application Form, Bank Statement", additionalInfo: "", status: "active" },
    { id: "v3", country: "Vietnam", countryCode: "VN", processingTime: "3-5 Business Days", visaFeeMMK: 95000, visaFeeUSD: 45, requirements: "Passport (6 months), 2 Passport Photos, Flight Booking", additionalInfo: "", status: "active" },
    { id: "v4", country: "China", countryCode: "CN", processingTime: "5-7 Business Days", visaFeeMMK: 150000, visaFeeUSD: 71, requirements: "Passport (6 months), 2 Passport Photos, Hotel Reservation", additionalInfo: "", status: "active" },
    { id: "v5", country: "Malaysia", countryCode: "MY", processingTime: "3-5 Business Days", visaFeeMMK: 75000, visaFeeUSD: 36, requirements: "Passport (6 months), 2 Passport Photos, Flight Booking", additionalInfo: "", status: "active" },
    { id: "v6", country: "Japan", countryCode: "JP", processingTime: "5-7 Business Days", visaFeeMMK: 130000, visaFeeUSD: 62, requirements: "Passport (6 months), Bank Statement, Employment Letter", additionalInfo: "", status: "active" },
    { id: "v7", country: "South Korea", countryCode: "KR", processingTime: "5-7 Business Days", visaFeeMMK: 115000, visaFeeUSD: 55, requirements: "Passport (6 months), 2 Passport Photos, Bank Statement", additionalInfo: "", status: "active" },
    { id: "v8", country: "United Arab Emirates", countryCode: "AE", processingTime: "3-5 Business Days", visaFeeMMK: 140000, visaFeeUSD: 67, requirements: "Passport (6 months), 2 Passport Photos, Bank Statement", additionalInfo: "", status: "active" },
    { id: "v9", country: "Cambodia", countryCode: "KH", processingTime: "2-3 Business Days", visaFeeMMK: 65000, visaFeeUSD: 31, requirements: "Passport (6 months), 2 Passport Photos, Flight Booking", additionalInfo: "", status: "active" },
    { id: "v10", country: "Indonesia", countryCode: "ID", processingTime: "3-5 Business Days", visaFeeMMK: 80000, visaFeeUSD: 38, requirements: "Passport (6 months), 2 Passport Photos, Bank Statement", additionalInfo: "", status: "active" },
    { id: "v11", country: "Taiwan", countryCode: "TW", processingTime: "5-7 Business Days", visaFeeMMK: 105000, visaFeeUSD: 50, requirements: "Passport (6 months), 2 Passport Photos, Employment Certificate", additionalInfo: "", status: "active" },
    { id: "v12", country: "Philippines", countryCode: "PH", processingTime: "5-7 Business Days", visaFeeMMK: 90000, visaFeeUSD: 43, requirements: "Passport (6 months), 2 Passport Photos, Bank Statement", additionalInfo: "", status: "active" },
    { id: "v13", country: "India", countryCode: "IN", processingTime: "5-7 Business Days", visaFeeMMK: 110000, visaFeeUSD: 52, requirements: "Passport (6 months), 2 Passport Photos, Flight Booking", additionalInfo: "", status: "active" },
    { id: "v14", country: "Australia", countryCode: "AU", processingTime: "10-15 Business Days", visaFeeMMK: 280000, visaFeeUSD: 133, requirements: "Passport (6 months), Bank Statement (6 months)", additionalInfo: "", status: "active" },
    { id: "v15", country: "United Kingdom", countryCode: "GB", processingTime: "10-15 Business Days", visaFeeMMK: 320000, visaFeeUSD: 152, requirements: "Passport (6 months), Bank Statement (6 months)", additionalInfo: "", status: "active" },
    { id: "v16", country: "Hong Kong", countryCode: "HK", processingTime: "3-5 Business Days", visaFeeMMK: 85000, visaFeeUSD: 40, requirements: "Passport (6 months), 2 Passport Photos, Hotel Reservation", additionalInfo: "", status: "active" },
    { id: "v17", country: "Macau", countryCode: "MO", processingTime: "3-5 Business Days", visaFeeMMK: 80000, visaFeeUSD: 38, requirements: "Passport (6 months), 2 Passport Photos, Flight Booking", additionalInfo: "", status: "active" },
    { id: "v18", country: "Sri Lanka", countryCode: "LK", processingTime: "3-5 Business Days", visaFeeMMK: 95000, visaFeeUSD: 45, requirements: "Passport (6 months), 2 Passport Photos, Bank Statement", additionalInfo: "", status: "active" },
    { id: "v19", country: "Nepal", countryCode: "NP", processingTime: "3-5 Business Days", visaFeeMMK: 75000, visaFeeUSD: 36, requirements: "Passport (6 months), 2 Passport Photos, Flight Booking", additionalInfo: "", status: "active" },
    { id: "v20", country: "Maldives", countryCode: "MV", processingTime: "2-3 Business Days", visaFeeMMK: 70000, visaFeeUSD: 33, requirements: "Passport (6 months), 2 Passport Photos, Hotel Reservation", additionalInfo: "", status: "active" },
    { id: "v21", country: "Laos", countryCode: "LA", processingTime: "2-3 Business Days", visaFeeMMK: 60000, visaFeeUSD: 29, requirements: "Passport (6 months), 2 Passport Photos, Flight Booking", additionalInfo: "", status: "active" },
    { id: "v22", country: "Brunei", countryCode: "BN", processingTime: "5-7 Business Days", visaFeeMMK: 100000, visaFeeUSD: 48, requirements: "Passport (6 months), 2 Passport Photos, Bank Statement", additionalInfo: "", status: "active" },
    { id: "v23", country: "Myanmar", countryCode: "MM", processingTime: "3-5 Business Days", visaFeeMMK: 90000, visaFeeUSD: 43, requirements: "Passport (6 months), 2 Passport Photos, Hotel Reservation", additionalInfo: "", status: "active" },
  ];
  visaData.forEach((v) => visas.set(v.id, v));

  // ── Insurances ──
  const insurances = new Map<string, unknown>();
  const insuranceData = [
    {
      id: "ins1", planName: "Basic Travel Shield", coverageAmountMMK: 5000000, coverageAmountUSD: 2381,
      premiumPriceMMK: 25000, premiumPriceUSD: 12, duration: "1-30 Days",
      benefits: "Medical Emergency Cover, Trip Cancellation, Lost Baggage, Personal Accident",
      exclusions: "Pre-existing conditions, Extreme sports", status: "active",
    },
    {
      id: "ins2", planName: "Gold Explorer Plan", coverageAmountMMK: 15000000, coverageAmountUSD: 7143,
      premiumPriceMMK: 55000, premiumPriceUSD: 26, duration: "1-90 Days",
      benefits: "Comprehensive Medical, Trip Delay Compensation, Lost Passport Assistance, Emergency Evacuation, Personal Liability",
      exclusions: "Pre-existing conditions, Hazardous activities", status: "active",
    },
    {
      id: "ins3", planName: "Family Vacation Plus", coverageAmountMMK: 25000000, coverageAmountUSD: 11905,
      premiumPriceMMK: 85000, premiumPriceUSD: 40, duration: "1-60 Days",
      benefits: "Full Family Cover, Child Medical Assistance, Trip Cancellation, Delayed Baggage, 24/7 Helpline, COVID-19 Cover",
      exclusions: "Pre-existing conditions, War zones", status: "active",
    },
    {
      id: "ins4", planName: "Premium Elite Guard", coverageAmountMMK: 50000000, coverageAmountUSD: 23810,
      premiumPriceMMK: 150000, premiumPriceUSD: 71, duration: "Up to 365 Days",
      benefits: "Unlimited Medical, Pre-existing Conditions, Business Equipment Cover, Concierge Service, Air Ambulance, Trip Curtailment, Personal Accident 24/7",
      exclusions: "War zones, Intentional self-harm", status: "featured",
    },
  ];
  insuranceData.forEach((ins) => insurances.set(ins.id, ins));

  // ── Bookings (empty initially, populated as users book) ──
  const bookings = new Map<string, unknown>();
  const demoBookings = [
    {
      id: "bk1", customerName: "Aung Myat", customerEmail: "aung@example.com", customerPhone: "09123456789",
      type: "tour", itemName: "Golden Land Explorer", itemId: "ft1", amount: 1850000, currency: "MMK",
      paymentStatus: "paid", bookingStatus: "confirmed", notes: "", travelDate: "2026-08-15", guests: 2,
      createdAt: new Date("2026-07-01").toISOString(), updatedAt: new Date("2026-07-01").toISOString(),
    },
    {
      id: "bk2", customerName: "Khin Thandar", customerEmail: "khin@example.com", customerPhone: "09987654321",
      type: "hotel", itemName: "Sule Shangri-La Yangon", itemId: "fh1", amount: 360000, currency: "MMK",
      paymentStatus: "pending", bookingStatus: "pending", notes: "Late check-in", travelDate: "2026-08-10", guests: 1,
      createdAt: new Date("2026-07-02").toISOString(), updatedAt: new Date("2026-07-02").toISOString(),
    },
    {
      id: "bk3", customerName: "Min Thu", customerEmail: "min@example.com", customerPhone: "09777123456",
      type: "car", itemName: "Toyota Alphard", itemId: "fc1", amount: 100000, currency: "MMK",
      paymentStatus: "paid", bookingStatus: "completed", notes: "", travelDate: "2026-06-28", guests: 4,
      createdAt: new Date("2026-06-25").toISOString(), updatedAt: new Date("2026-06-28").toISOString(),
    },
    {
      id: "bk4", customerName: "Su Mon Aung", customerEmail: "sumon@example.com", customerPhone: "09555111222",
      type: "visa", itemName: "Thailand Visa", itemId: "v1", amount: 85000, currency: "MMK",
      paymentStatus: "paid", bookingStatus: "confirmed", notes: "Urgent processing", travelDate: "2026-07-20", guests: 1,
      createdAt: new Date("2026-07-03").toISOString(), updatedAt: new Date("2026-07-03").toISOString(),
    },
    {
      id: "bk5", customerName: "Ye Htet", customerEmail: "yehtet@example.com", customerPhone: "09888777666",
      type: "insurance", itemName: "Basic Travel Shield", itemId: "ins1", amount: 25000, currency: "MMK",
      paymentStatus: "paid", bookingStatus: "confirmed", notes: "", travelDate: "2026-08-01", guests: 1,
      createdAt: new Date("2026-07-04").toISOString(), updatedAt: new Date("2026-07-04").toISOString(),
    },
  ];
  demoBookings.forEach((b) => bookings.set(b.id, b));

  // ── Inquiries (booking-receiver) ──
  const inquiries = new Map<string, unknown>();
  const inquiryData = [
    {
      _id: "inq1", fullName: "Kyaw Zin", email: "kyawzin@example.com", phone: "09111222333",
      travelType: "flight", fromAirport: "RGN", toAirport: "BKK", departDate: "2026-08-20",
      returnDate: "2026-08-25", passengers: 2, travelClass: "Economy",
      specialRequests: "Vegetarian meal", contactPreference: "email", status: "New",
      referenceNumber: "A9-M7K2F", createdAt: new Date("2026-07-05").toISOString(),
    },
    {
      _id: "inq2", fullName: "Nwe Ni", email: "nweni@example.com", phone: "09444333222",
      travelType: "tour", fromAirport: "", toAirport: "", departDate: "2026-09-01",
      returnDate: "2026-09-07", passengers: 4, travelClass: "",
      specialRequests: "Interested in Bagan and Inle Lake combo", contactPreference: "phone", status: "Contacted",
      referenceNumber: "A9-L3P8R", createdAt: new Date("2026-07-04").toISOString(),
    },
    {
      _id: "inq3", fullName: "Zaw Gyi", email: "zawgyi@example.com", phone: "09666555444",
      travelType: "hotel", fromAirport: "", toAirport: "", departDate: "2026-08-15",
      returnDate: "", passengers: 1, travelClass: "",
      specialRequests: "Need beachfront hotel in Ngapali", contactPreference: "email", status: "New",
      referenceNumber: "A9-W5K9T", createdAt: new Date("2026-07-03").toISOString(),
    },
    {
      _id: "inq4", fullName: "Thin Zar", email: "thinzaw@example.com", phone: "09777888999",
      travelType: "visa", fromAirport: "", toAirport: "", departDate: "2026-08-10",
      returnDate: "", passengers: 1, travelClass: "",
      specialRequests: "Need Japan visa for business trip", contactPreference: "phone", status: "Confirmed",
      referenceNumber: "A9-J2P4M", createdAt: new Date("2026-07-01").toISOString(),
    },
    {
      _id: "inq5", fullName: "Phone Myint", email: "phone@example.com", phone: "09999000111",
      travelType: "car", fromAirport: "", toAirport: "", departDate: "2026-07-20",
      returnDate: "2026-07-25", passengers: 6, travelClass: "",
      specialRequests: "Need a van for family trip to Bagan", contactPreference: "email", status: "New",
      referenceNumber: "A9-C8F3A", createdAt: new Date("2026-07-05").toISOString(),
    },
  ];
  inquiryData.forEach((inq) => inquiries.set(inq._id, inq));

  collections.set("tours", tours);
  collections.set("hotels", hotels);
  collections.set("cars", cars);
  collections.set("visas", visas);
  collections.set("insurances", insurances);
  collections.set("bookings", bookings);
  collections.set("inquiries", inquiries);
}

// Ensure seeded on first import
seed();

// ─── Exported Helpers ───

export function getCollection(name: string): Map<string, unknown> {
  seed();
  const col = collections.get(name);
  if (!col) {
    collections.set(name, new Map());
    return collections.get(name)!;
  }
  return col;
}

export function getAll(name: string): unknown[] {
  const col = getCollection(name);
  return Array.from(col.values());
}

export function getById(name: string, id: string): unknown | undefined {
  const col = getCollection(name);
  return col.get(id);
}

export function create(name: string, data: Record<string, unknown>): unknown {
  const col = getCollection(name);
  const newId = generateId();
  const item = {
    id: newId,
    _id: newId,
    ...data,
    createdAt: data.createdAt || new Date().toISOString(),
  };
  col.set((item as Record<string, unknown>).id as string, item);
  return item;
}

export function update(name: string, id: string, data: Record<string, unknown>): unknown | null {
  const col = getCollection(name);
  const existing = col.get(id);
  if (!existing) return null;
  const updated = { ...(existing as Record<string, unknown>), ...data, id, updatedAt: new Date().toISOString() };
  col.set(id, updated);
  return updated;
}

export function delete_(name: string, id: string): boolean {
  const col = getCollection(name);
  return col.delete(id);
}

// For booking-receiver / inquiries compatibility
export function getInquiries(page = 1, limit = 50, statusFilter?: string) {
  const col = getCollection("inquiries");
  let all = Array.from(col.values()) as Record<string, unknown>[];

  if (statusFilter && statusFilter !== "all") {
    all = all.filter((i) => i.status === statusFilter);
  }

  // Sort by createdAt descending
  all.sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());

  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);

  return { data, pagination: { page, limit, total, totalPages } };
}

// For bookings with pagination
export function getBookings(page = 1, limit = 10, statusFilter?: string) {
  const col = getCollection("bookings");
  let all = Array.from(col.values()) as Record<string, unknown>[];

  if (statusFilter && statusFilter !== "all") {
    all = all.filter((b) => b.paymentStatus === statusFilter || b.bookingStatus === statusFilter);
  }

  // Sort by createdAt descending
  all.sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());

  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);

  return { bookings: data, totalPages, total, page, limit };
}

// Dashboard stats
export function getDashboardStats() {
  const totalTours = getCollection("tours").size;
  const totalHotels = getCollection("hotels").size;
  const totalCars = getCollection("cars").size;
  const totalVisas = getCollection("visas").size;
  const totalInsurances = getCollection("insurances").size;
  const totalBookings = getCollection("bookings").size;
  const totalInquiries = getCollection("inquiries").size;

  const bookingCol = getCollection("bookings");
  const allBookings = Array.from(bookingCol.values()) as Record<string, unknown>[];
  const revenueMMK = allBookings
    .filter((b) => b.paymentStatus === "paid" || b.paymentStatus === "completed")
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const pendingPayments = allBookings.filter((b) => b.paymentStatus === "pending").length;

  return {
    totalTours,
    totalHotels,
    totalCars,
    totalBookings,
    totalVisas,
    totalInsurances,
    totalInquiries,
    revenueMMK,
    pendingPayments,
  };
}
