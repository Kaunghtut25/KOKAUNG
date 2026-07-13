// persistentStore.ts — MongoDB Atlas-backed persistent storage
// On Vercel serverless: tries MongoDB, falls back to in-memory if unreachable

let mongoClient: any = null;
let mongoDb: any = null;
let mongoFailed = false;

const MONGO_URI = process.env.MONGODB_URI || '';

async function getMongo() {
  if (mongoDb) return mongoDb;
  if (!MONGO_URI || mongoFailed) throw new Error('MongoDB unavailable');
  try {
    const { MongoClient } = await import('mongodb');
    mongoClient = new MongoClient(MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      maxPoolSize: 1,
      minPoolSize: 0,
    });
    await mongoClient.connect();
    mongoDb = mongoClient.db('a9global');
    console.log('[DB] MongoDB Atlas connected ✓');
    return mongoDb;
  } catch (err: any) {
    mongoFailed = true;
    console.warn('[DB] MongoDB unavailable — using in-memory store:', err.message?.substring(0, 80));
    throw err;
  }
}

let memoryStore: Record<string, Map<string, any>> = {};

function ensureCollection(name: string): Map<string, any> {
  if (!memoryStore[name]) memoryStore[name] = new Map();
  return memoryStore[name];
}

// Seeded defaults so public pages always have content
function seedDefaults(name: string) {
  const coll = ensureCollection(name);
  if (coll.size > 0) return;
  const seeds: Record<string, any[]> = {
    tours: [
      { id: 't1', title: 'Golden Land Explorer', destination: 'Bagan', description: 'Explore ancient temples', priceMMK: 450000, priceUSD: 215, duration: '3 Days', rating: 4.8, reviewCount: 124, images: [], status: 'active' },
      { id: 't2', title: 'Yangon Heritage Walk', destination: 'Yangon', description: 'Discover colonial Yangon', priceMMK: 250000, priceUSD: 120, duration: '1 Day', rating: 4.5, reviewCount: 89, images: [], status: 'active' },
      { id: 't3', title: 'Inle Lake Serenity', destination: 'Inle Lake', description: 'Floating gardens & leg rowers', priceMMK: 550000, priceUSD: 262, duration: '3 Days', rating: 4.7, reviewCount: 156, images: [], status: 'active' },
      { id: 't4', title: 'Ngapali Beach Escape', destination: 'Ngapali', description: 'Pristine beaches', priceMMK: 650000, priceUSD: 310, duration: '4 Days', rating: 4.6, reviewCount: 98, images: [], status: 'active' },
      { id: 't5', title: 'Mandalay Royal Tour', destination: 'Mandalay', description: 'Royal palace & U Bein Bridge', priceMMK: 380000, priceUSD: 181, duration: '2 Days', rating: 4.4, reviewCount: 112, images: [], status: 'active' },
      { id: 't6', title: 'Myanmar Grand Loop', destination: 'Multi-City', description: 'Yangon-Bagan-Mandalay-Inle', priceMMK: 1200000, priceUSD: 572, duration: '10 Days', rating: 4.9, reviewCount: 67, images: [], status: 'featured' },
    ],
    hotels: [
      { id: 'h1', title: 'Sule Shangri-La Yangon', destination: 'Yangon', description: '5-star luxury', priceMMK: 180000, priceUSD: 86, rating: 4.7, reviewCount: 234, images: [], status: 'active' },
      { id: 'h2', title: 'Bagan Lodge', destination: 'Bagan', description: 'Desert oasis resort', priceMMK: 220000, priceUSD: 105, rating: 4.8, reviewCount: 189, images: [], status: 'active' },
      { id: 'h3', title: 'Inle Princess Resort', destination: 'Inle Lake', description: 'Lakefront luxury', priceMMK: 250000, priceUSD: 119, rating: 4.6, reviewCount: 156, images: [], status: 'active' },
      { id: 'h4', title: 'Mandalay Hill Resort', destination: 'Mandalay', description: 'Hilltop views', priceMMK: 160000, priceUSD: 76, rating: 4.5, reviewCount: 178, images: [], status: 'active' },
      { id: 'h5', title: 'Ngapali Bay Villas', destination: 'Ngapali', description: 'Beachfront villas', priceMMK: 350000, priceUSD: 167, rating: 4.9, reviewCount: 92, images: [], status: 'featured' },
      { id: 'h6', title: 'Chatrium Hotel Yangon', destination: 'Yangon', description: 'Royal lake views', priceMMK: 140000, priceUSD: 67, rating: 4.4, reviewCount: 312, images: [], status: 'active' },
    ],
    cars: [
      { id: 'c1', title: 'Toyota Probox', type: 'Economy', description: 'Reliable budget sedan', pricePerDayMMK: 45000, pricePerDayUSD: 21, passengers: 4, status: 'active' },
      { id: 'c2', title: 'Toyota Alphard', type: 'Luxury', description: 'Premium MPV', pricePerDayMMK: 120000, pricePerDayUSD: 57, passengers: 7, status: 'active' },
      { id: 'c3', title: 'Honda Fit', type: 'Compact', description: 'City-friendly', pricePerDayMMK: 35000, pricePerDayUSD: 17, passengers: 4, status: 'active' },
      { id: 'c4', title: 'Toyota Land Cruiser', type: 'SUV', description: 'Off-road capable', pricePerDayMMK: 150000, pricePerDayUSD: 71, passengers: 7, status: 'active' },
      { id: 'c5', title: 'Nissan Van', type: 'Van', description: 'Group travel', pricePerDayMMK: 80000, pricePerDayUSD: 38, passengers: 12, status: 'active' },
      { id: 'c6', title: 'BMW X5', type: 'Premium', description: 'Executive SUV', pricePerDayMMK: 250000, pricePerDayUSD: 119, passengers: 5, status: 'featured' },
    ],
    visas: [
      { id: 'v1', country: 'Thailand', visaType: 'Tourist', processingTime: '3-5 Days', feeMMK: 85000, feeUSD: 40, status: 'active' },
      { id: 'v2', country: 'Singapore', visaType: 'Tourist', processingTime: '5-7 Days', feeMMK: 65000, feeUSD: 31, status: 'active' },
      { id: 'v3', country: 'Malaysia', visaType: 'Tourist', processingTime: '3-5 Days', feeMMK: 55000, feeUSD: 26, status: 'active' },
      { id: 'v4', country: 'Vietnam', visaType: 'Tourist', processingTime: '2-3 Days', feeMMK: 45000, feeUSD: 21, status: 'active' },
      { id: 'v5', country: 'Japan', visaType: 'Tourist', processingTime: '7-10 Days', feeMMK: 120000, feeUSD: 57, status: 'active' },
      { id: 'v6', country: 'South Korea', visaType: 'Tourist', processingTime: '5-7 Days', feeMMK: 95000, feeUSD: 45, status: 'active' },
      { id: 'v7', country: 'China', visaType: 'Tourist', processingTime: '5-7 Days', feeMMK: 110000, feeUSD: 52, status: 'active' },
      { id: 'v8', country: 'India', visaType: 'Tourist', processingTime: '3-5 Days', feeMMK: 75000, feeUSD: 36, status: 'active' },
      { id: 'v9', country: 'UAE (Dubai)', visaType: 'Tourist', processingTime: '3-5 Days', feeMMK: 135000, feeUSD: 64, status: 'active' },
      { id: 'v10', country: 'Cambodia', visaType: 'Tourist', processingTime: '2-3 Days', feeMMK: 35000, feeUSD: 17, status: 'active' },
      { id: 'v11', country: 'Laos', visaType: 'Tourist', processingTime: '2-3 Days', feeMMK: 30000, feeUSD: 14, status: 'active' },
      { id: 'v12', country: 'Indonesia', visaType: 'Tourist', processingTime: '3-5 Days', feeMMK: 60000, feeUSD: 29, status: 'active' },
    ],
    insurance: [
      { id: 'ins1', planName: 'Basic Travel Shield', coverageAmountMMK: 5000000, coverageAmountUSD: 2381, premiumMMK: 25000, premiumUSD: 12, duration: '1-30 Days', provider: 'A9 Global Insurance', status: 'active' },
      { id: 'ins2', planName: 'Premium Explorer', coverageAmountMMK: 15000000, coverageAmountUSD: 7143, premiumMMK: 65000, premiumUSD: 31, duration: '1-90 Days', provider: 'A9 Global Insurance', status: 'active' },
      { id: 'ins3', planName: 'Family Protection', coverageAmountMMK: 30000000, coverageAmountUSD: 14286, premiumMMK: 120000, premiumUSD: 57, duration: '1-180 Days', provider: 'A9 Global Insurance', status: 'active' },
      { id: 'ins4', planName: 'Business Traveler', coverageAmountMMK: 20000000, coverageAmountUSD: 9524, premiumMMK: 85000, premiumUSD: 40, duration: '1-365 Days', provider: 'A9 Global Insurance', status: 'featured' },
      { id: 'ins5', planName: 'Student Guard', coverageAmountMMK: 10000000, coverageAmountUSD: 4762, premiumMMK: 45000, premiumUSD: 21, duration: '30-365 Days', provider: 'A9 Global Insurance', status: 'active' },
      { id: 'ins6', planName: 'Senior Comfort', coverageAmountMMK: 12000000, coverageAmountUSD: 5714, premiumMMK: 55000, premiumUSD: 26, duration: '1-90 Days', provider: 'A9 Global Insurance', status: 'active' },
    ],
    cruises: [
      { id: 'cr1', title: 'Ayeyarwady Sunset Cruise', route: 'Mandalay-Bagan', description: '3-day river cruise', priceMMK: 350000, priceUSD: 167, duration: '3 Days', capacity: 40, status: 'active' },
      { id: 'cr2', title: 'Mergui Archipelago Explorer', route: 'Kawthaung-Mergui', description: '5-day island hopping', priceMMK: 850000, priceUSD: 405, duration: '5 Days', capacity: 20, status: 'active' },
      { id: 'cr3', title: 'Yangon River Dinner Cruise', route: 'Yangon River Loop', description: 'Evening dinner cruise', priceMMK: 85000, priceUSD: 40, duration: '3 Hours', capacity: 60, status: 'active' },
      { id: 'cr4', title: 'Andaman Sea Adventure', route: 'Myeik Archipelago', description: '7-day diving cruise', priceMMK: 1200000, priceUSD: 572, duration: '7 Days', capacity: 16, status: 'featured' },
      { id: 'cr5', title: 'Irrawaddy Explorer', route: 'Bhamo-Pyay', description: '10-day grand river journey', priceMMK: 2000000, priceUSD: 953, duration: '10 Days', capacity: 36, status: 'active' },
      { id: 'cr6', title: 'Chindwin Discovery', route: 'Monywa-Homalin', description: '6-day off-beaten track', priceMMK: 1500000, priceUSD: 715, duration: '6 Days', capacity: 24, status: 'active' },
    ],
  };
  const items = seeds[name];
  if (items) items.forEach(item => coll.set(item.id, item));
}

// ─── Public API ───

export async function getAll(collection: string): Promise<any[]> {
  try {
    const db = await getMongo();
    return await db.collection(collection).find({}).toArray();
  } catch {
    seedDefaults(collection);
    return Array.from((memoryStore[collection] || new Map()).values());
  }
}

export async function getById(collection: string, id: string): Promise<any | null> {
  try {
    const db = await getMongo();
    const { ObjectId } = await import('mongodb');
    return await db.collection(collection).findOne({ _id: ObjectId.isValid(id) ? new ObjectId(id) : id });
  } catch {
    seedDefaults(collection);
    return memoryStore[collection]?.get(id) || null;
  }
}

export async function create(collection: string, data: Record<string, any>): Promise<any> {
  try {
    const db = await getMongo();
    const result = await db.collection(collection).insertOne({ ...data, createdAt: new Date().toISOString() });
    return { ...data, _id: result.insertedId.toString(), id: result.insertedId.toString() };
  } catch {
    seedDefaults(collection);
    const id = data.id || `gen_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const item = { ...data, id, _id: id, createdAt: data.createdAt || new Date().toISOString() };
    memoryStore[collection]?.set(id, item);
    return item;
  }
}

export async function update(collection: string, id: string, data: Record<string, any>): Promise<any | null> {
  try {
    const db = await getMongo();
    const { ObjectId } = await import('mongodb');
    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
    await db.collection(collection).updateOne(filter, { $set: { ...data, updatedAt: new Date().toISOString() } });
    return await db.collection(collection).findOne(filter);
  } catch {
    seedDefaults(collection);
    const existing = memoryStore[collection]?.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data, id, _id: id, updatedAt: new Date().toISOString() };
    memoryStore[collection]?.set(id, updated);
    return updated;
  }
}

export async function delete_(collection: string, id: string): Promise<boolean> {
  try {
    const db = await getMongo();
    const { ObjectId } = await import('mongodb');
    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
    await db.collection(collection).deleteOne(filter);
    return true;
  } catch {
    seedDefaults(collection);
    return memoryStore[collection]?.delete(id) || false;
  }
}
// ─── Aliases for backward compatibility ───

export const updateById = update;
export const deleteById = delete_;

export async function getBookings(page = 1, limit = 10, statusFilter?: string) {
  const bookings = await getAll('bookings');
  let filtered = bookings;
  if (statusFilter && statusFilter !== 'all') {
    filtered = bookings.filter((b: any) => b.status === statusFilter);
  }
  const total = filtered.length;
  const start = (page - 1) * limit;
  return {
    data: filtered.slice(start, start + limit),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
}

export async function getDashboardStats() {
  const [tours, hotels, cars, visas, insurance, cruises, bookings, blog] = await Promise.all([
    getAll('tours'), getAll('hotels'), getAll('cars'), getAll('visas'),
    getAll('insurance'), getAll('cruises'), getAll('bookings'), getAll('blog'),
  ]);
  return {
    totalUsers: 1,
    totalBookings: (bookings || []).length,
    totalRevenue: 0,
    activeTours: (tours || []).filter((t: any) => t.status === 'active' || !t.status).length,
    activeHotels: (hotels || []).filter((h: any) => h.status === 'active' || !h.status).length,
    activeCars: (cars || []).filter((c: any) => c.status === 'active' || !c.status).length,
    activeVisas: (visas || []).filter((v: any) => v.status === 'active' || !v.status).length,
    activeInsurances: (insurance || []).filter((i: any) => i.status === 'active' || !i.status).length,
    activeCruises: (cruises || []).filter((c: any) => c.status === 'active' || !c.status).length,
    pendingBookings: (bookings || []).filter((b: any) => b.status === 'pending' || !b.status).length,
    recentBookings: (bookings || []).slice(0, 5),
    tours, hotels, cars, visas, insurance, cruises, blog,
  };
}