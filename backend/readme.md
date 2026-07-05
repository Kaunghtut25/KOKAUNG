# A9 Global Travels & Tours 🌏

A full-stack travel booking platform for **A9 Global Travels & Tours**, specializing in Myanmar and Southeast Asia travel packages, hotel bookings, car rentals, visa processing, and travel insurance.

Built with a modern MERN stack, the platform offers a seamless experience for travelers to browse, book, and manage their travel services — from the golden temples of Bagan to the beaches of Ngapali.

---

## 🛠 Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Auth**    | JWT (JSON Web Tokens), bcryptjs     |
| **Payments**| KBZPay, WavePay integration         |
| **Dev**     | Nodemon, dotenv                     |

---

## 📋 Prerequisites

- **Node.js** v18 or higher
- **MongoDB** v6.0+ (local or Atlas)
- **npm** v9+

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd a9global-v2/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```
MONGO_URI=mongodb://localhost:27017/a9global
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
```

### 4. Seed the Database

```bash
npm run seed
```

This creates:
- 👤 2 users (Admin + Test Customer)
- 🌏 12 tour packages across Myanmar & Southeast Asia
- 🏨 8 hotels with room types
- 🚗 6 car rentals
- 🛂 6 visa services
- 🛡️ 4 insurance plans
- 📋 2 sample bookings

### 5. Start the Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5000` by default.

---

## 🔐 Test Accounts

| Role     | Email               | Password    |
|----------|---------------------|-------------|
| Admin    | admin@a9global.com  | admin123    |
| Customer | customer@test.com   | test123     |

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint            | Description          | Auth |
|--------|---------------------|----------------------|------|
| POST   | `/api/auth/register`| Register new user    | No   |
| POST   | `/api/auth/login`   | Login & get JWT      | No   |
| GET    | `/api/auth/me`      | Get current user     | Yes  |

### Tours

| Method | Endpoint             | Description              | Auth  |
|--------|----------------------|--------------------------|-------|
| GET    | `/api/tours`         | List all tours           | No    |
| GET    | `/api/tours/featured`| List featured tours      | No    |
| GET    | `/api/tours/:slug`   | Get single tour by slug  | No    |
| GET    | `/api/tours/:id`     | Get single tour by ID    | No    |
| POST   | `/api/tours`         | Create tour              | Admin |
| PUT    | `/api/tours/:id`     | Update tour              | Admin |
| DELETE | `/api/tours/:id`     | Delete tour              | Admin |

### Hotels

| Method | Endpoint              | Description              | Auth  |
|--------|-----------------------|--------------------------|-------|
| GET    | `/api/hotels`         | List all hotels          | No    |
| GET    | `/api/hotels/featured`| List featured hotels     | No    |
| GET    | `/api/hotels/:slug`   | Get single hotel         | No    |
| POST   | `/api/hotels`         | Create hotel             | Admin |
| PUT    | `/api/hotels/:id`     | Update hotel             | Admin |
| DELETE | `/api/hotels/:id`     | Delete hotel             | Admin |

### Cars

| Method | Endpoint            | Description            | Auth  |
|--------|---------------------|------------------------|-------|
| GET    | `/api/cars`         | List all cars          | No    |
| GET    | `/api/cars/:slug`   | Get single car         | No    |
| POST   | `/api/cars`         | Create car             | Admin |
| PUT    | `/api/cars/:id`     | Update car             | Admin |
| DELETE | `/api/cars/:id`     | Delete car             | Admin |

### Visa Services

| Method | Endpoint            | Description            | Auth  |
|--------|---------------------|------------------------|-------|
| GET    | `/api/visas`        | List all visa services | No    |
| GET    | `/api/visas/:code`  | Get visa by country code| No   |
| POST   | `/api/visas`        | Create visa service    | Admin |
| PUT    | `/api/visas/:id`    | Update visa service    | Admin |
| DELETE | `/api/visas/:id`    | Delete visa service    | Admin |

### Insurance

| Method | Endpoint              | Description             | Auth  |
|--------|-----------------------|-------------------------|-------|
| GET    | `/api/insurance`      | List all plans          | No    |
| GET    | `/api/insurance/:slug`| Get single plan         | No    |
| POST   | `/api/insurance`      | Create plan             | Admin |
| PUT    | `/api/insurance/:id`  | Update plan             | Admin |
| DELETE | `/api/insurance/:id`  | Delete plan             | Admin |

### Bookings

| Method | Endpoint             | Description              | Auth     |
|--------|----------------------|--------------------------|----------|
| GET    | `/api/bookings`      | List user's bookings     | Customer |
| GET    | `/api/bookings/:id`  | Get single booking       | Customer |
| POST   | `/api/bookings`      | Create new booking       | Customer |
| PUT    | `/api/bookings/:id`  | Update booking           | Customer |
| GET    | `/api/admin/bookings`| List all bookings        | Admin    |

---

## 🔧 Environment Variables

| Variable       | Description                         | Default                          |
|----------------|-------------------------------------|----------------------------------|
| `MONGO_URI`    | MongoDB connection string           | `mongodb://localhost:27017/a9global` |
| `JWT_SECRET`   | Secret key for JWT signing          | *(required)*                     |
| `JWT_EXPIRE`   | JWT token expiration                | `30d`                            |
| `PORT`         | Server port                         | `5000`                           |
| `NODE_ENV`     | Environment mode                    | `development`                    |

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── tourController.js  # Tour CRUD
│   ├── hotelController.js # Hotel CRUD
│   ├── carController.js   # Car CRUD
│   ├── visaController.js  # Visa CRUD
│   ├── insuranceController.js # Insurance CRUD
│   └── bookingController.js   # Booking logic
├── middleware/
│   ├── auth.js            # JWT auth middleware
│   ├── admin.js           # Admin role check
│   └── errorHandler.js    # Global error handler
├── models/
│   ├── User.js
│   ├── Tour.js
│   ├── Hotel.js
│   ├── Car.js
│   ├── Visa.js
│   ├── Insurance.js
│   └── Booking.js
├── routes/
│   ├── authRoutes.js
│   ├── tourRoutes.js
│   ├── hotelRoutes.js
│   ├── carRoutes.js
│   ├── visaRoutes.js
│   ├── insuranceRoutes.js
│   └── bookingRoutes.js
├── utils/
│   └── helpers.js          # Utility functions
├── seed.js                 # Database seed script
├── server.js               # Express app entry point
├── package.json
├── .env.example
└── README.md
```

---

## 📝 Notes

- **Currency:** All prices are in **MMK** (Myanmar Kyat). USD equivalents are auto-calculated at rate of 1 USD = 2,100 MMK.
- **Payments:** The platform supports **KBZPay** and **WavePay** — Myanmar's leading mobile payment systems.
- **Images:** Uses Unsplash for high-quality travel photography. All image URLs follow the pattern `https://images.unsplash.com/photo-{ID}?w=800&h=600&fit=crop`.
- **MongoDB:** The seed script drops all existing data before inserting fresh records. Use with caution in production.

---

## 📄 License

This project is proprietary software owned by **A9 Global Travels & Tours**. All rights reserved.

---

**A9 Global Travels & Tours** — *Your Gateway to the Golden Land* 🦚
