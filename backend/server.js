const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

async function start() {
  await connectDB();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/tours', require('./routes/tourRoutes'));
  app.use('/api/hotels', require('./routes/hotelRoutes'));
  app.use('/api/cars', require('./routes/carRoutes'));
  app.use('/api/visas', require('./routes/visaRoutes'));
  app.use('/api/insurance', require('./routes/insuranceRoutes'));
  app.use('/api/search', require('./routes/searchRoutes'));
  app.use('/api/bookings', require('./routes/bookingRoutes'));
  app.use('/api/admin', require('./routes/adminRoutes'));
  app.use('/api/booking-receiver', require('./routes/bookingReceiver'));

  app.get('/', (req, res) => {
    res.json({ success: true, message: 'A9 Global API v1.0.0' });
  });

  app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: err.message });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`[Server] API on port ${PORT}`);
    // Auto-seed asynchronously
    setTimeout(async () => {
      try {
        const TourPackage = require('./models/tourpackage');
        const count = await TourPackage.countDocuments();
        if (count === 0) {
          console.log('[Seed] Running seed...');
          const seed = require('./seed');
          await seed();
          console.log('[Seed] Done — database populated');
        }
      } catch(e) { console.log('[Seed]', e.message); }
    }, 2000);
  });
}

start();
module.exports = app;
