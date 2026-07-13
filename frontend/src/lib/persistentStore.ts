// persistentStore.ts — MongoDB Atlas-backed persistent storage
// Falls back to in-memory adminStore if MongoDB is unavailable

import { getAll as memGetAll, getById as memGetById, create as memCreate, update as memUpdate, delete_ as memDelete } from './adminStore';

// Determine the backend
let backend: 'memory' | 'mongo' = 'memory';

// ─── Try MongoDB Atlas ───
const MONGO_URI = process.env.MONGODB_URI || '';

let mongoClient: any = null;
let mongoDb: any = null;

async function getMongo() {
  if (mongoDb) return mongoDb;
  if (!MONGO_URI) throw new Error('No MONGODB_URI set');
  try {
    // Dynamic require to avoid bundling issues
    const { MongoClient } = await import('mongodb');
    mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();
    mongoDb = mongoClient.db('a9global');
    console.log('[DB] MongoDB connected');
    return mongoDb;
  } catch (err) {
    console.error('[DB] MongoDB connection failed:', err);
    throw err;
  }
}

// ─── Public API ───

export async function getAll(collection: string): Promise<any[]> {
  if (backend === 'mongo') {
    try {
      const db = await getMongo();
      return await db.collection(collection).find({}).toArray();
    } catch {
      // Fall through to memory
    }
  }
  return memGetAll(collection);
}

export async function getById(collection: string, id: string): Promise<any | null> {
  if (backend === 'mongo') {
    try {
      const db = await getMongo();
      const { ObjectId } = await import('mongodb');
      return await db.collection(collection).findOne({ _id: ObjectId.isValid(id) ? new ObjectId(id) : id });
    } catch {}
  }
  return memGetById(collection, id) as any;
}

export async function create(collection: string, data: Record<string, any>): Promise<any> {
  if (backend === 'mongo') {
    try {
      const db = await getMongo();
      const doc = { ...data, createdAt: data.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
      delete doc._id; // Let Mongo generate
      const result = await db.collection(collection).insertOne(doc);
      return { ...doc, _id: result.insertedId.toString() };
    } catch {}
  }
  return memCreate(collection, data);
}

export async function update(collection: string, id: string, data: Record<string, any>): Promise<any> {
  if (backend === 'mongo') {
    try {
      const db = await getMongo();
      const { ObjectId } = await import('mongodb');
      const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
      const doc = { ...data, updatedAt: new Date().toISOString() };
      delete doc._id;
      await db.collection(collection).updateOne(filter, { $set: doc });
      return { ...data, _id: id, updatedAt: new Date().toISOString() };
    } catch {}
  }
  return memUpdate(collection, id, data);
}

export async function delete_(collection: string, id: string): Promise<boolean> {
  if (backend === 'mongo') {
    try {
      const db = await getMongo();
      const { ObjectId } = await import('mongodb');
      const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
      const result = await db.collection(collection).deleteOne(filter);
      return result.deletedCount > 0;
    } catch {}
  }
  return memDelete(collection, id);
}

// Enable MongoDB if URI is set
export function enableMongo() {
  if (MONGO_URI) {
    backend = 'mongo';
    console.log('[DB] Using MongoDB Atlas backend');
  }
}

// ─── Alias exports (match adminStore API) ───

export async function updateById(collection: string, id: string, data: Record<string, any>): Promise<any> {
  return update(collection, id, data);
}

export async function deleteById(collection: string, id: string): Promise<boolean> {
  return delete_(collection, id);
}

export async function getDashboardStats() {
  // Returns aggregate stats from all collections
  const cols = ['tours','hotels','cars','cruises','visas','insurances','blog','bookings','inquiries'];
  const stats: Record<string, number> = {};
  for (const c of cols) {
    try { stats[c] = (await getAll(c)).length; } catch { stats[c] = 0; }
  }
  return stats;
}

export async function getBookings(page = 1, limit = 10, statusFilter?: string) {
  let items = await getAll('bookings');
  if (statusFilter) items = items.filter((b: any) => b.status === statusFilter);
  const total = items.length;
  const start = (page - 1) * limit;
  return { data: items.slice(start, start + limit), total, page, limit };
}

export async function getInquiries(page = 1, limit = 50, statusFilter?: string) {
  let items = await getAll('inquiries');
  if (statusFilter) items = items.filter((b: any) => b.status === statusFilter);
  const total = items.length;
  const start = (page - 1) * limit;
  return { data: items.slice(start, start + limit), total, page, limit };
}