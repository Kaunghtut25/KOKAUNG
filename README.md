# Heaven on the Clouds — Luxury Travels & Tours

A full-stack luxury travel booking platform with Next.js frontend, Express API, and MongoDB.

## Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, TypeScript
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB
- **Bot:** Telegram integration for customer inquiries

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for MongoDB) or a local MongoDB instance

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
cp .env.example backend/.env
cp .env.example frontend/.env.local

# Start MongoDB
docker compose up -d

# Run development servers
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
heaven-on-clouds-travel/
├── frontend/          # Next.js app
├── backend/           # Express API
├── packages/shared/   # Shared types & validators
├── telegram-bot/      # Telegram chatbot
└── docs/              # Documentation
```

## Theme

**Heaven on the Clouds** — Gold, Sky Blue, and White palette with futuristic luxury aesthetics.
