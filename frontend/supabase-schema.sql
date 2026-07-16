-- A9 Global Travel - Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tours table
CREATE TABLE IF NOT EXISTS tours (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  destination TEXT,
  description TEXT,
  priceMMK INTEGER DEFAULT 0,
  priceUSD INTEGER DEFAULT 0,
  duration TEXT,
  images TEXT,
  amenities TEXT,
  included TEXT,
  excluded TEXT,
  maxGroupSize INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  featured BOOLEAN DEFAULT false,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  location TEXT,
  address TEXT,
  description TEXT,
  rating INTEGER DEFAULT 3,
  pricePerNightMMK INTEGER DEFAULT 0,
  pricePerNightUSD INTEGER DEFAULT 0,
  availableRooms INTEGER DEFAULT 0,
  totalRooms INTEGER DEFAULT 0,
  amenities TEXT,
  images TEXT,
  roomTypes JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active',
  featured BOOLEAN DEFAULT false,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- Cars table
CREATE TABLE IF NOT EXISTS cars (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  carType TEXT NOT NULL,
  description TEXT,
  capacity INTEGER DEFAULT 4,
  features TEXT,
  images TEXT,
  pricing JSONB DEFAULT '[]'::jsonb,
  transmission TEXT DEFAULT 'Automatic',
  seats INTEGER DEFAULT 4,
  status TEXT DEFAULT 'active',
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- Cruises table
CREATE TABLE IF NOT EXISTS cruises (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  destination TEXT,
  description TEXT,
  priceMMK INTEGER DEFAULT 0,
  priceUSD INTEGER DEFAULT 0,
  duration TEXT,
  images TEXT,
  amenities TEXT,
  included TEXT,
  excluded TEXT,
  maxGroupSize INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  featured BOOLEAN DEFAULT false,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- Visas table
CREATE TABLE IF NOT EXISTS visas (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  country TEXT NOT NULL,
  countryCode TEXT,
  processingTime TEXT,
  visaFeeMMK INTEGER DEFAULT 0,
  visaFeeUSD INTEGER DEFAULT 0,
  requirements TEXT,
  additionalInfo TEXT,
  status TEXT DEFAULT 'active',
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- Insurances table
CREATE TABLE IF NOT EXISTS insurances (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  planName TEXT NOT NULL,
  coverageAmountMMK INTEGER DEFAULT 0,
  coverageAmountUSD INTEGER DEFAULT 0,
  premiumPriceMMK INTEGER DEFAULT 0,
  premiumPriceUSD INTEGER DEFAULT 0,
  duration TEXT,
  benefits TEXT,
  exclusions TEXT,
  status TEXT DEFAULT 'active',
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- Mingalar (Sky Lounge) table
CREATE TABLE IF NOT EXISTS mingalar (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  desc TEXT,
  icon TEXT DEFAULT '✨',
  img TEXT,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- Blog table
CREATE TABLE IF NOT EXISTS blog (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  content TEXT,
  image TEXT,
  author TEXT DEFAULT 'A9 Global Team',
  tags TEXT,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  bookingId TEXT UNIQUE,
  itemType TEXT,
  itemId TEXT,
  itemName TEXT,
  travelDate TEXT,
  quantity INTEGER DEFAULT 1,
  travelers INTEGER DEFAULT 1,
  customerName TEXT,
  customerEmail TEXT,
  customerPhone TEXT,
  specialRequests TEXT,
  totalAmount INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'MMK',
  paymentMethod TEXT,
  paymentStatus TEXT DEFAULT 'pending',
  bookingStatus TEXT DEFAULT 'confirmed',
  transactionId TEXT,
  createdAt TIMESTAMPTZ DEFAULT NOW()
);

-- Insert seed data for tours
INSERT INTO tours (id, title, destination, description, priceMMK, priceUSD, duration, images, amenities, included, excluded, maxGroupSize, status, featured) VALUES
('t1', 'Golden Land Explorer', 'Bagan', 'Explore ancient temples of Bagan', 450000, 215, '5 Days / 4 Nights', '["/images_v2/bagan-v2.jpg"]', 'Guide, AC Transport, Breakfast', 'Hotel, Meals, Guide, Transport', 'Flights, Visa Fees', 15, 'active', true),
('t2', 'Yangon City Lights', 'Yangon', 'Discover colonial charm of Yangon', 250000, 119, '3 Days / 2 Nights', '["/images_v2/yangon-v2.jpg"]', 'Guide, AC Transport, Breakfast', 'Hotel, Meals, Guide', 'Flights, Visa Fees', 12, 'active', false),
('t3', 'Inle Lake Serenity', 'Inle', 'Floating gardens & markets', 380000, 181, '4 Days / 3 Nights', '["/images_v2/inle-v2.jpg"]', 'Boat, Guide, Breakfast', 'Hotel, Meals, Boat Tours', 'Flights, Visa Fees', 10, 'active', true),
('t4', 'Ngapali Beach Bliss', 'Ngapali', 'Pristine beach getaway', 520000, 248, '5 Days / 4 Nights', '["/images_v2/ngapali-v2.jpg"]', 'Beach, Pool, Breakfast', 'Hotel, Meals, Airport Transfer', 'Flights, Visa Fees', 8, 'active', true),
('t5', 'Mandalay Royal Tour', 'Mandalay', 'Last royal capital of Myanmar', 320000, 152, '4 Days / 3 Nights', '["/images_v2/mandalay-v2.jpg"]', 'Guide, AC Transport, Breakfast', 'Hotel, Meals, Guide', 'Flights, Visa Fees', 15, 'active', false),
('t6', 'Myanmar Grand Tour', 'Multi', 'Complete Myanmar experience', 850000, 405, '10 Days / 9 Nights', '["/images_v2/myanmar-v2.jpg"]', 'Guide, AC Transport, Breakfast, Domestic Flights', 'Hotels, Meals, Guide, Transport, Flights', 'International Flights, Visa Fees', 12, 'active', true)
ON CONFLICT (id) DO NOTHING;

-- Insert seed data for hotels
INSERT INTO hotels (id, name, location, address, description, rating, pricePerNightMMK, pricePerNightUSD, availableRooms, totalRooms, amenities, images, roomTypes, status, featured) VALUES
('h1', 'Sule Shangri-La Yangon', 'Yangon', '223 Sule Pagoda Road, Yangon', 'Luxury 5-star hotel in downtown Yangon', 5, 180000, 86, 20, 280, 'Pool, WiFi, Gym, Restaurant, Spa, Bar', '["/images_v2/hotel1-v3.jpg"]', '[{"name":"Deluxe Room","priceMMK":180000,"priceUSD":86,"capacity":2,"available":10},{"name":"Executive Suite","priceMMK":350000,"priceUSD":167,"capacity":3,"available":5}]'::jsonb, 'active', true),
('h2', 'Aureum Palace Bagan', 'Bagan', 'Hotel Zone, Nyaung Oo, Bagan', 'Boutique luxury resort near Bagan temples', 5, 220000, 105, 15, 110, 'Pool, WiFi, Gym, Restaurant, Spa', '["/images_v2/hotel2-v3.jpg"]', '[{"name":"Garden Villa","priceMMK":220000,"priceUSD":105,"capacity":2,"available":8}]'::jsonb, 'active', true),
('h3', 'Novotel Yangon Max', 'Yangon', '459 Pyay Road, Yangon', 'Modern international hotel', 4, 150000, 71, 30, 250, 'Pool, WiFi, Gym, Restaurant, Bar', '["/images_v2/hotel3-v3.jpg"]', '[{"name":"Superior Room","priceMMK":150000,"priceUSD":71,"capacity":2,"available":15}]'::jsonb, 'active', false),
('h4', 'Pristine Lotus Inle', 'Inle', 'Inle Lake, Nyaungshwe', 'Overwater bungalows on Inle Lake', 5, 200000, 95, 12, 48, 'Pool, WiFi, Restaurant, Boat Tours', '["/images_v2/hotel4-v3.jpg"]', '[{"name":"Lake Villa","priceMMK":200000,"priceUSD":95,"capacity":2,"available":6}]'::jsonb, 'active', true),
('h5', 'Mandalay Hill Resort', 'Mandalay', 'Mandalay Hill Road, Mandalay', 'Resort at the foot of Mandalay Hill', 4, 170000, 81, 25, 200, 'Pool, WiFi, Gym, Restaurant', '["/images_v2/hotel5-v3.jpg"]', '[{"name":"Deluxe Room","priceMMK":170000,"priceUSD":81,"capacity":2,"available":12}]'::jsonb, 'active', false),
('h6', 'Amazing Ngapali Resort', 'Ngapali', 'Ngapali Beach, Thandwe', 'Beachfront luxury resort', 5, 250000, 119, 8, 60, 'Pool, WiFi, Gym, Restaurant, Beach, Spa', '["/images_v2/hotel6-v2.jpg"]', '[{"name":"Beach Villa","priceMMK":250000,"priceUSD":119,"capacity":2,"available":4}]'::jsonb, 'active', true)
ON CONFLICT (id) DO NOTHING;

-- Insert seed data for cars
INSERT INTO cars (id, carType, description, capacity, features, images, pricing, transmission, seats, status) VALUES
('c1', 'Toyota Alphard', 'Luxury MPV with captain seats', 7, 'AC, Leather Seats, WiFi, GPS', '["/images_v2/car1-v2.jpg"]', '[{"duration":"Full Day","priceMMK":150000,"priceUSD":71},{"duration":"Half Day","priceMMK":90000,"priceUSD":43}]'::jsonb, 'Automatic', 7, 'active'),
('c2', 'Toyota Wish', 'Affordable family wagon', 5, 'AC, GPS, Fuel Efficient', '["/images_v2/car2-v2.jpg"]', '[{"duration":"Full Day","priceMMK":80000,"priceUSD":38}]'::jsonb, 'Automatic', 5, 'active'),
('c3', 'Toyota Noah', 'Spacious 7-seater for groups', 7, 'AC, Luggage Space, GPS', '["/images_v2/car3-v2.jpg"]', '[{"duration":"Full Day","priceMMK":85000,"priceUSD":40}]'::jsonb, 'CVT', 7, 'active'),
('c4', 'Alphard Executive', 'Executive-class travel experience', 6, 'AC, Massage Seats, Premium Sound', '["/images_v2/car4-v2.jpg"]', '[{"duration":"Full Day","priceMMK":200000,"priceUSD":95}]'::jsonb, 'Automatic', 6, 'active'),
('c5', 'Minibus 15-Seater', 'Perfect for large group trips', 15, 'AC, Large Group, Luggage', '["/images_v2/car5-v2.jpg"]', '[{"duration":"Full Day","priceMMK":120000,"priceUSD":57}]'::jsonb, 'Manual', 15, 'active'),
('c6', 'Probox Budget', 'No-frills budget transport', 4, 'AC, Budget, Fuel Efficient', '["/images_v2/car6-v2.jpg"]', '[{"duration":"Full Day","priceMMK":50000,"priceUSD":24}]'::jsonb, 'Automatic', 4, 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert seed data for visas
INSERT INTO visas (id, country, countryCode, processingTime, visaFeeMMK, visaFeeUSD, requirements, additionalInfo, status) VALUES
('v1', 'Thailand', 'TH', '3-5 Working Days', 60000, 29, 'Passport valid 6+ months, 2 passport photos, Bank statement, Flight itinerary', 'eVisa available online', 'active'),
('v2', 'Singapore', 'SG', '3 Working Days', 45000, 21, 'Passport valid 6+ months, 2 passport photos, Hotel booking, Bank statement', 'eVisa available', 'active'),
('v3', 'Malaysia', 'MY', '2-3 Working Days', 40000, 19, 'Passport valid 6+ months, 2 passport photos, Flight itinerary', 'eVisa available', 'active'),
('v4', 'Vietnam', 'VN', '3-5 Working Days', 55000, 26, 'Passport valid 6+ months, 2 passport photos', 'eVisa or VOA available', 'active'),
('v5', 'Cambodia', 'KH', '3 Working Days', 50000, 24, 'Passport valid 6+ months, 2 passport photos', 'eVisa or VOA', 'active'),
('v6', 'Laos', 'LA', '3-5 Working Days', 45000, 21, 'Passport valid 6+ months, 2 passport photos', 'eVisa or VOA', 'active'),
('v7', 'India', 'IN', '5-7 Working Days', 75000, 36, 'Passport valid 6+ months, 2 passport photos, Bank statement', 'eVisa available', 'active'),
('v8', 'Japan', 'JP', '5-7 Working Days', 55000, 26, 'Passport valid 6+ months, 2 passport photos, Bank statement, Invitation letter', 'Requires physical documents', 'active'),
('v9', 'South Korea', 'KR', '5-7 Working Days', 50000, 24, 'Passport valid 6+ months, 2 passport photos, Bank statement', 'eVisa available', 'active'),
('v10', 'China', 'CN', '5-7 Working Days', 80000, 38, 'Passport valid 6+ months, 2 passport photos, Hotel booking, Flight itinerary', 'Requires physical documents', 'active'),
('v11', 'UAE (Dubai)', 'AE', '5-7 Working Days', 120000, 57, 'Passport valid 6+ months, 2 passport photos, Bank statement, Hotel booking', 'eVisa available', 'active'),
('v12', 'Turkey', 'TR', '3-5 Working Days', 90000, 43, 'Passport valid 6+ months, 2 passport photos', 'eVisa available', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert seed data for insurances
INSERT INTO insurances (id, planName, coverageAmountMMK, coverageAmountUSD, premiumPriceMMK, premiumPriceUSD, duration, benefits, exclusions, status) VALUES
('i1', 'Basic Travel Shield', 5000000, 2380, 15000, 7, 'Per Trip (up to 7 days)', 'Medical expenses, Trip delay coverage, Emergency hotline', 'Pre-existing conditions, Extreme sports, Self-inflicted injuries', 'active'),
('i2', 'Standard Travel Guard', 10000000, 4760, 25000, 12, 'Per Trip (up to 14 days)', 'Medical expenses, Baggage loss, Trip cancellation, Emergency hotline', 'Pre-existing conditions, Extreme sports, Alcohol-related incidents', 'active'),
('i3', 'Premium Travel Protect', 20000000, 9520, 45000, 21, 'Annual (multi-trip)', 'Medical expenses, Trip cancellation, Baggage loss, Evacuation, Family coverage', 'Pre-existing conditions, War zones, Nuclear incidents', 'active'),
('i4', 'Family Travel Plan', 15000000, 7140, 60000, 29, 'Per Trip (up to 14 days)', 'Family medical, Trip cancellation, Baggage loss, Child care coverage', 'Pre-existing conditions, Extreme sports', 'active'),
('i5', 'Business Travel Cover', 12000000, 5710, 35000, 17, 'Per Trip (up to 10 days)', 'Business equipment coverage, Medical, Trip cancellation', 'Pre-existing conditions, Leisure sports', 'active'),
('i6', 'Senior Travel Care', 18000000, 8570, 50000, 24, 'Per Trip (up to 30 days)', 'Medical expenses, Emergency evacuation, Hospital cash allowance', 'Pre-existing conditions (unless declared), Extreme sports', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert seed data for mingalar
INSERT INTO mingalar (id, title, desc, icon, img) VALUES
('m1', 'Fine Dining', 'Premium à la carte dining experience', '🍽️', '/images_v2/sky1-v3.jpg'),
('m2', 'Open Bar', 'Premium spirits, wine & cocktails', '🍸', '/images_v2/sky2-v3.jpg'),
('m3', 'Private Suite', 'Spacious lie-flat seating with privacy', '🛋️', '/images_v2/sky3-v3.jpg'),
('m4', 'Spa Service', 'Pre-flight massage & wellness treatments', '💆', '/images_v2/sky-vip-v2.jpg'),
('m5', 'Business Center', 'Meeting rooms, printing & high-speed WiFi', '💼', '/images_v2/sky-business-v2.jpg'),
('m6', 'Personal Concierge', 'Dedicated concierge for all your travel needs', '🤵', '/images_v2/sky-main-v2.jpg')
ON CONFLICT (id) DO NOTHING;

-- Insert seed data for cruises
INSERT INTO cruises (id, title, destination, description, priceMMK, priceUSD, duration, images, amenities, included, excluded, maxGroupSize, status, featured) VALUES
('cr1', 'Halong Bay Cruise', 'Vietnam', 'Luxury overnight cruise in Halong Bay', 650000, 310, '3 Days / 2 Nights', '["/images_v2/cruise1-v2.jpg"]', 'AC Cabin, Restaurant, Bar, Sun Deck', 'Cabin, Meals, Tours, Kayaking', 'Flights, Visa Fees', 20, 'active', true),
('cr2', 'Singapore River Cruise', 'Singapore', 'Scenic river cruise through Singapore', 350000, 167, '1 Day', '["/images_v2/cruise2-v2.jpg"]', 'AC, Refreshments, Guide', 'Cruise, Meals, Guide', 'Flights, Hotel', 30, 'active', false),
('cr3', 'Irrawaddy River Cruise', 'Myanmar', 'Luxury cruise along the Irrawaddy River', 850000, 405, '7 Days / 6 Nights', '["/images_v2/cruise3-v2.jpg"]', 'AC Cabin, Restaurant, Bar, Pool, Spa', 'Cabin, Meals, Tours, Guide', 'Flights, Visa Fees', 15, 'active', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security but allow anon access (for now)
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE cruises ENABLE ROW LEVEL SECURITY;
ALTER TABLE visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurances ENABLE ROW LEVEL SECURITY;
ALTER TABLE mingalar ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anon to read all tables
CREATE POLICY "anon_read_all" ON tours FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_all" ON hotels FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_all" ON cars FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_all" ON cruises FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_all" ON visas FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_all" ON insurances FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_all" ON mingalar FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_all" ON blog FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_all" ON bookings FOR SELECT TO anon USING (true);

-- Allow anon to insert/update/delete (for admin panel)
CREATE POLICY "anon_write_all" ON tours FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_write_all" ON hotels FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_write_all" ON cars FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_write_all" ON cruises FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_write_all" ON visas FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_write_all" ON insurances FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_write_all" ON mingalar FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_write_all" ON blog FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_write_all" ON bookings FOR ALL TO anon USING (true) WITH CHECK (true);
